import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MessageCircle, Send, X } from 'lucide-react';
import { siteData } from '../data.js';
import { answerQuestion, type ChatReply } from '../utils/chatbot';

type ChatMessage = ChatReply & { id: number; role: 'assistant' | 'user' };

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 0, role: 'assistant', text: siteData.chatbot.welcome }]);
  const sequence = useRef(1);
  const timer = useRef<number | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const conversationEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationEnd.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }, [messages, thinking, open]);

  useEffect(() => () => { if (timer.current !== null) window.clearTimeout(timer.current); }, []);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        requestAnimationFrame(() => trigger.current?.focus());
      }
    }
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  function ask(rawQuestion: string) {
    const question = rawQuestion.trim();
    if (!question || timer.current !== null) return;
    setMessages(previous => [...previous, { id: sequence.current++, role: 'user', text: question }]);
    setDraft('');
    setThinking(true);
    timer.current = window.setTimeout(() => {
      const reply = answerQuestion(question, messages.filter(message => message.role === 'user').at(-1)?.text);
      setMessages(previous => [...previous, { id: sequence.current++, role: 'assistant', ...reply }]);
      setThinking(false);
      timer.current = null;
    }, siteData.chatbot.responseDelayMs);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ask(draft);
  }

  return <div className={`remedy-chat${open ? ' is-open' : ''}`}>
    {open && <section className="remedy-chat-panel" id="remedy-chat-panel" aria-label={siteData.chatbot.title}>
      <header className="remedy-chat-header"><div><span className="chat-status-dot" aria-hidden="true" /><div><h2>{siteData.chatbot.title}</h2><p>{siteData.chatbot.subtitle}</p></div></div><button className="chat-close" type="button" aria-label={siteData.chatbot.closeLabel} onClick={() => { setOpen(false); requestAnimationFrame(() => trigger.current?.focus()); }}><X size={20} aria-hidden="true" /></button></header>
      <div className="remedy-chat-scroll">
        <div className="remedy-chat-messages" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions text">
          {messages.map(message => <article key={message.id} className={`remedy-chat-message chat-${message.role}`}>
            <p>{message.text}</p>
            {!!message.actions?.length && <div className="chat-reply-actions">
              {message.actions.map(action => action.href.startsWith('http') || action.href.startsWith('tel:')
                ? <a key={action.href} href={action.href} target={action.href.startsWith('http') ? '_blank' : undefined} rel={action.href.startsWith('http') ? 'noreferrer' : undefined}><span>{action.label}</span><ArrowUpRight size={14} aria-hidden="true" /></a>
                : <Link key={action.href} to={action.href} onClick={() => setOpen(false)}><span>{action.label}</span><ArrowUpRight size={14} aria-hidden="true" /></Link>)}
            </div>}
          </article>)}
          {thinking && <div className="chat-typing" role="status"><span>{siteData.chatbot.typing}</span><i /><i /><i /></div>}
          <div ref={conversationEnd} />
        </div>
      </div>
      <form className="remedy-chat-form" onSubmit={submit}><label className="sr-only" htmlFor="remedy-chat-input">{siteData.chatbot.placeholder}</label><input id="remedy-chat-input" value={draft} onChange={event => setDraft(event.target.value)} placeholder={siteData.chatbot.placeholder} maxLength={240} autoComplete="off" disabled={thinking} /><button className="chat-send" type="submit" disabled={thinking || !draft.trim()} aria-label={siteData.chatbot.sendLabel}><Send size={18} aria-hidden="true" /></button></form>
    </section>}
    <button ref={trigger} className="remedy-chat-trigger" type="button" aria-expanded={open} aria-controls="remedy-chat-panel" aria-label={open ? siteData.chatbot.closeLabel : siteData.chatbot.openLabel} onClick={() => setOpen(value => !value)}>{open ? <X size={23} aria-hidden="true" /> : <MessageCircle size={23} aria-hidden="true" />}</button>
  </div>;
}
