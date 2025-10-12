import React, { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import AdminModal from './FoodModalAdmin'

const List = ({ url }) => {
    const [list, setList] = useState([])
        const [loading, setLoading] = useState(false)
        const [error, setError] = useState('')
        const [selected, setSelected] = useState(null)

    const fetchList = async () => {
            setLoading(true)
            setError('')
            try {
                const response = await axios.get(`${url}/api/food/list`)
                if (response.data && response.data.success) setList(response.data.data)
                else {
                    setError('Failed to fetch list')
                    toast.error('Failed to fetch list')
                }
            } catch (err) {
                console.error('fetchList error', err)
                setError('Error fetching list')
                toast.error('Error fetching list')
            } finally {
                setLoading(false)
            }
    }

    const removeFood = async (foodId) => {
        try {
            const response = await axios.post(`${url}/api/food/remove`, { id: foodId })
            if (response.data.success) {
                toast.success(response.data.message)
                await fetchList()
            } else toast.error('Error')
        } catch (err) {
            console.error(err)
            toast.error('Error removing food')
        }
    }

    useEffect(() => {
        fetchList()
    }, [])

    const buildSrc = (img) => {
        const placeholder = ''
        if (!img) return placeholder
        const trimmed = String(img).trim()
        if (/^https?:\/\//i.test(trimmed)) return trimmed
        if (trimmed.startsWith('/')) return (url || '') + trimmed
        return (url ? url.replace(/\/$/, '') : '') + '/images/' + trimmed
    }

        return (
            <div className="admin-list">
                <h2>All Foods</h2>
                        {loading && <p>Loading...</p>}
                        {error && (
                            <div className="error-block">
                                <p className="error">{error}</p>
                                <button onClick={fetchList} className="retry">Retry</button>
                            </div>
                        )}
                <div className="card-grid">
                    {list.map((item) => (
                        <div className="card" key={item._id} onClick={() => setSelected(item)}>
                            <div className="card-img">
                                <img src={buildSrc(item.image)} alt={item.name} />
                            </div>
                            <div className="card-body">
                                <h3>{item.name}</h3>
                                <p className="category">{item.category}</p>
                                <p className="price">${item.price}</p>
                                <div className="card-actions">
                                    <button className="remove" onClick={(e)=>{ e.stopPropagation(); removeFood(item._id); }}>Remove</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {selected && (
                    <AdminModal item={selected} onClose={() => setSelected(null)} url={url} onRemove={async(id)=>{ await removeFood(id); setSelected(null); }} />
                )}
            </div>
        )
}

export default List