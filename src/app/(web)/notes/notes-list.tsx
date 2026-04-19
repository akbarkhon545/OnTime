"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Note {
  id: string
  title: string
  content: string
  color: string
  createdAt: Date
}

export function NotesList({ initialNotes, lang }: { initialNotes: any[], lang: string }) {
  const [notes, setNotes] = useState(initialNotes)
  const [isAdding, setIsAdding] = useState(false)
  const [newNote, setNewNote] = useState({ title: "", content: "", color: "#ffffff" })
  const [loading, setLoading] = useState(false)
  const isRu = lang === "ru"

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.title || !newNote.content) return

    setLoading(true)
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
      })

      if (res.ok) {
        const created = await res.json()
        setNotes([created, ...notes])
        setNewNote({ title: "", content: "", color: "#ffffff" })
        setIsAdding(false)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const deleteNote = async (id: string) => {
    if (!confirm(isRu ? "Удалить эту заметку?" : "Eslatmani o'chirmoqchimisiz?")) return

    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" })
      if (res.ok) {
        setNotes(notes.filter(n => n.id !== id))
      }
    } catch (error) {
      console.error(error)
    }
  }

  const noteColors = [
    "#ffffff", // White
    "#fef3c7", // Amber
    "#dcfce7", // Emerald
    "#dbeafe", // Blue
    "#f3e8ff", // Purple
    "#fee2e2", // Red
  ]

  return (
    <div className="space-y-8">
      {/* Add Note Area */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 overflow-hidden relative group">
        {!isAdding ? (
          <div 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-4 cursor-pointer text-slate-400 hover:text-indigo-500 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-xl group-hover:bg-indigo-50 transition-colors">
              ➕
            </div>
            <span className="font-bold">{isRu ? "Добавить новую заметку..." : "Yangi eslatma qo'shish..."}</span>
          </div>
        ) : (
          <form onSubmit={addNote} className="space-y-4 animate-in slide-in-from-top-2 duration-300">
            <input 
              type="text"
              value={newNote.title}
              onChange={e => setNewNote({...newNote, title: e.target.value})}
              placeholder={isRu ? "Заголовок" : "Sarlavha"}
              className="w-full text-xl font-black text-slate-800 placeholder-slate-300 outline-none"
              autoFocus
            />
            <textarea 
              value={newNote.content}
              onChange={e => setNewNote({...newNote, content: e.target.value})}
              placeholder={isRu ? "Текст заметки..." : "Eslatma matni..."}
              className="w-full min-h-[100px] text-slate-600 font-medium placeholder-slate-300 outline-none resize-none"
            />
            
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-50">
              <div className="flex gap-2">
                {noteColors.map(c => (
                  <button 
                    key={c}
                    type="button"
                    onClick={() => setNewNote({...newNote, color: c})}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${newNote.color === c ? 'border-indigo-500 scale-110 shadow-lg' : 'border-slate-100 shadow-sm'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-2.5 rounded-xl text-xs font-black text-slate-400 hover:bg-slate-50 transition-all"
                >
                  {isRu ? "ОТМЕНА" : "BEKOR QILISH"}
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-black shadow-lg shadow-indigo-200 hover:shadow-indigo-400 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? "..." : (isRu ? "СОХРАНИТЬ" : "SAQLASH")}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <div 
            key={note.id}
            className="group rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-100 transition-all hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden flex flex-col min-h-[200px]"
            style={{ backgroundColor: note.color === '#ffffff' ? '#ffffff' : note.color + '40' }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-black text-slate-800 text-lg leading-tight">{note.title}</h3>
              <button 
                onClick={() => deleteNote(note.id)}
                className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all"
              >
                🗑
              </button>
            </div>
            <p className="text-slate-600 font-medium text-sm whitespace-pre-wrap flex-1 mb-4">{note.content}</p>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {new Date(note.createdAt).toLocaleDateString(isRu ? 'ru-RU' : 'uz-UZ')}
            </div>
          </div>
        ))}
      </div>

      {notes.length === 0 && !isAdding && (
        <div className="py-20 text-center bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="text-7xl mb-6">🖋️</div>
          <p className="text-slate-400 font-bold text-lg">{isRu ? "Заметок пока нет" : "Eslatmalar hali yo'q"}</p>
        </div>
      )}
    </div>
  )
}
