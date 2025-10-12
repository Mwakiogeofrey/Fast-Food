import React, { useState } from 'react'
import './List.css'
import axios from 'axios'

const FoodModalAdmin = ({ item, onClose, url, onRemove }) => {
  if (!item) return null

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: item.name, description: item.description, price: item.price, category: item.category })
  const [newFiles, setNewFiles] = useState([])
  const [confirmDelete, setConfirmDelete] = useState(false)

  const buildSrc = (img) => {
    if (!img) return ''
    const trimmed = String(img).trim()
    if (/^https?:\/\//i.test(trimmed)) return trimmed
    if (trimmed.startsWith('/')) return (url || '') + trimmed
    return (url ? url.replace(/\/$/, '') : '') + '/images/' + trimmed
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('id', item._id)
    fd.append('name', form.name)
    fd.append('description', form.description)
    fd.append('price', form.price)
    fd.append('category', form.category)
    newFiles.forEach(f=>fd.append('images', f))
    try{
      const res = await axios.post(`${url}/api/food/edit`, fd)
      if (res.data.success) {
        setEditing(false)
        window.location.reload()
      }
    }catch(err){ console.error(err) }
  }

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" onClick={(e)=>e.stopPropagation()}>
        <button className="admin-close" onClick={onClose}>×</button>
        <div className="admin-modal-body">
          <div className="admin-modal-img">
            <img src={buildSrc(item.image)} alt={item.name} onError={(e)=>{ e.target.onerror=null; e.target.src='/src/assets/logo.png' }} />
          </div>
          <div className="admin-modal-info">
            {!editing ? (
              <>
                <h2>{item.name}</h2>
                <p className="category">{item.category}</p>
                <p className="price">${item.price}</p>
                <p className="desc">{item.description}</p>
                <div className="admin-modal-actions">
                  <button onClick={()=>setEditing(true)} className="edit">Edit</button>
                  {!confirmDelete ? (
                    <button onClick={()=>setConfirmDelete(true)} className="remove">Remove</button>
                  ) : (
                    <>
                      <button onClick={()=>onRemove(item._id)} className="remove confirm">Confirm</button>
                      <button onClick={()=>setConfirmDelete(false)} className="cancel">Cancel</button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <form onSubmit={handleEditSubmit} className='edit-form'>
                <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
                <input value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} />
                <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                  <option>Salad</option>
                  <option>Rolls</option>
                  <option>Deserts</option>
                  <option>Sandwich</option>
                  <option>Cake</option>
                  <option>Pure Veg</option>
                  <option>Pasta</option>
                  <option>Noodles</option>
                </select>
                <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} />
                <div className='new-files'>
                  <input multiple onChange={e=>setNewFiles(Array.from(e.target.files))} type='file' />
                </div>
                <div className='edit-actions'>
                  <button type='submit' className='save'>Save</button>
                  <button type='button' onClick={()=>setEditing(false)} className='cancel'>Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FoodModalAdmin
