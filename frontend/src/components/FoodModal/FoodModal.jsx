import React, { useState } from 'react'
import './FoodModal.css'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { StoreContext } from '../../Context/StoreContext'

const FoodModal = ({ item, onClose }) => {
  const { addToCart, url } = useContext(StoreContext)
  if (!item) return null

  // For now we only have single image; support array if provided
  const images = item.images && item.images.length ? item.images : [item.image]
  const [index, setIndex] = useState(0)

  const buildSrc = (img) => {
    if (!img) return assets.header_img || assets.logo || ''
    const trimmed = String(img).trim()
    if (/^https?:\/\//i.test(trimmed)) return trimmed
    if (trimmed.startsWith('/')) return (url || '') + trimmed
    return (url ? url.replace(/\/$/, '') : '') + '/images/' + trimmed
  }

  return (
    <div className="food-modal-backdrop" onClick={onClose}>
      <div className="food-modal" onClick={(e)=>e.stopPropagation()}>
        <button className="close" onClick={onClose}>×</button>
        <div className="gallery">
          <div className="main-img">
            <img src={buildSrc(images[index])} alt={item.name} />
          </div>
          <div className="thumbs">
            {images.map((img, i) => (
              <img key={i} onClick={()=>setIndex(i)} className={i===index? 'active': ''} src={buildSrc(img)} alt={item.name} />
            ))}
          </div>
        </div>
        <div className="details">
          <h2>{item.name}</h2>
          <p className="price">${item.price}</p>
          <p className="desc">{item.description}</p>
          <div className="actions">
            <button className="add" onClick={()=>{ addToCart(item._id); onClose(); }}>Add to cart</button>
            <button className="order" onClick={()=>{ addToCart(item._id); window.location.href='/order'; }}>Book now</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FoodModal
