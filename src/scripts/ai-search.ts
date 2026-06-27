/**
 * AI Search client-side script
 * Handles panel open/close, message sending, SSE streaming, and markdown rendering
 */

// --- Simple Markdown renderer ---
function renderMarkdown(text: string): string {
  let html = text;

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
    return `<pre><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, (_match, code) => {
    return `<code>${escapeHtml(code)}</code>`;
  });

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Line breaks
  html = html.replace(/\n/g, '<br>');

  return html;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// --- Panel logic ---
function initAISearch() {
  const trigger = document.querySelector<HTMLButtonElement>('.ai-search-trigger');
  const widget = document.querySelector<HTMLElement>('.ai-float-widget');

  if (!trigger || !widget) return;

  const panel = widget!.querySelector<HTMLElement>('.ai-float-panel')!;
  const closeBtn = widget!.querySelector<HTMLButtonElement>('.ai-float-close')!;
  const messagesContainer = widget!.querySelector<HTMLElement>('.ai-float-messages')!;
  const form = widget!.querySelector<HTMLFormElement>('.ai-float-input-form')!;
  const input = widget!.querySelector<HTMLInputElement>('.ai-float-input')!;
  const sendBtn = widget!.querySelector<HTMLButtonElement>('.ai-float-send')!;
  const emptyState = widget!.querySelector<HTMLElement>('.ai-float-empty');

  const apiEndpoint = trigger.dataset.api || '/api/ai-search';
  let isOpen = false;
  let isStreaming = false;

  function open() {
    if (isOpen) return;
    isOpen = true;
    widget!.setAttribute('data-open', '');
    widget!.setAttribute('aria-hidden', 'false');
    trigger!.setAttribute('data-active', '');
    // Focus input after animation
    setTimeout(() => input.focus(), 250);
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    widget!.removeAttribute('data-open');
    widget!.setAttribute('aria-hidden', 'true');
    trigger!.removeAttribute('data-active');
  }

  function toggle() {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }

  trigger.addEventListener('click', toggle);
  closeBtn.addEventListener('click', close);

  // Click backdrop to close (mobile)
  widget!.addEventListener('click', (e) => {
    if (isOpen && e.target === widget) {
      close();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) close();
  });

  // --- Message helpers ---
  function removeEmpty() {
    if (emptyState && emptyState.parentElement) {
      emptyState.remove();
    }
  }

  function addUserMessage(text: string) {
    removeEmpty();
    const bubble = document.createElement('div');
    bubble.className = 'ai-msg ai-msg-user';
    bubble.textContent = text;
    messagesContainer.appendChild(bubble);
    scrollToBottom();
  }

  function addAIMessage(): HTMLElement {
    removeEmpty();
    const bubble = document.createElement('div');
    bubble.className = 'ai-msg ai-msg-ai';
    messagesContainer.appendChild(bubble);
    return bubble;
  }

  function addTypingIndicator(): HTMLElement {
    const indicator = document.createElement('div');
    indicator.className = 'ai-msg ai-msg-ai ai-typing';
    indicator.innerHTML =
      '<div class="ai-typing-dot"></div><div class="ai-typing-dot"></div><div class="ai-typing-dot"></div>';
    messagesContainer.appendChild(indicator);
    scrollToBottom();
    return indicator;
  }

  function addErrorMessage(text: string) {
    const bubble = document.createElement('div');
    bubble.className = 'ai-msg ai-msg-error';
    bubble.textContent = text;
    messagesContainer.appendChild(bubble);
    scrollToBottom();
  }

  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // --- Send message ---
  async function sendMessage(question: string) {
    if (!question.trim() || isStreaming) return;

    isStreaming = true;
    sendBtn.disabled = true;
    input.value = '';

    addUserMessage(question);

    const typingIndicator = addTypingIndicator();
    const aiBubble = addAIMessage();
    aiBubble.style.display = 'none';

    let fullText = '';

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Check if response is SSE stream
      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('text/event-stream') && response.body) {
        // SSE streaming response
        typingIndicator.remove();
        aiBubble.style.display = '';

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  fullText += parsed.content;
                  aiBubble.innerHTML = renderMarkdown(fullText);
                  scrollToBottom();
                }
              } catch {
                // Plain text fallback
                fullText += data;
                aiBubble.innerHTML = renderMarkdown(fullText);
                scrollToBottom();
              }
            }
          }
        }
      } else {
        // JSON response (non-streaming)
        const data = await response.json();
        typingIndicator.remove();
        aiBubble.style.display = '';

        if (data.answer) {
          fullText = data.answer;
          aiBubble.innerHTML = renderMarkdown(fullText);
        } else if (data.error) {
          aiBubble.remove();
          addErrorMessage(data.error);
          return;
        } else {
          aiBubble.innerHTML = renderMarkdown(JSON.stringify(data));
        }
      }
    } catch (err) {
      typingIndicator.remove();
      aiBubble.remove();

      const errorMsg =
        err instanceof Error ? err.message : '未知错误';
      addErrorMessage(`请求失败: ${errorMsg}。请稍后重试。`);
    } finally {
      isStreaming = false;
      sendBtn.disabled = false;
      input.focus();
      scrollToBottom();
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const question = input.value.trim();
    if (question) sendMessage(question);
  });
}

// Init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAISearch);
} else {
  initAISearch();
}
