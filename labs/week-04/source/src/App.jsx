import { useState } from 'react'

const initialRequests = [
  { id: '1', title: 'Air Conditioner Repair', location: 'Building 4, Room 402', priority: 'High', status: 'Pending' },
  { id: '2', title: 'Projector Bulb Replacement', location: 'Library Room 2', priority: 'Medium', status: 'In Progress' }
]

export default function App() {
  const [requests, setRequests] = useState(initialRequests)
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [priority, setPriority] = useState('Medium')

  const handleAddRequest = (e) => {
    e.preventDefault()
    if (!title.trim() || !location.trim()) return

    const newReq = {
      id: Date.now().toString(),
      title: title.trim(),
      location: location.trim(),
      priority,
      status: 'Pending'
    }

    setRequests([newReq, ...requests])
    setTitle('')
    setLocation('')
    setPriority('Medium')
  }

  const handleDelete = (id) => {
    setRequests(requests.filter(item => item.id !== id))
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Campus Service Request</h1>
        <p>ระบบแจ้งซ่อมและบริการภายในมหาวิทยาลัย</p>
      </header>

      <form onSubmit={handleAddRequest}>
        <div className="form-group">
          <label htmlFor="req-title">หัวข้อแจ้งซ่อม / ปัญหา</label>
          <input
            id="req-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ระบุชื่อปัญหา"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="req-loc">สถานที่ / ห้อง</label>
          <input
            id="req-loc"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="เช่น อาคาร 4 ห้อง 402"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="req-priority">ระดับความสำคัญ</label>
          <select
            id="req-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <button type="submit" className="btn-submit">ส่งคำร้อง</button>
      </form>

      <div className="card-list">
        <h3>รายการคำร้อง ({requests.length})</h3>
        {requests.map((item) => (
          <div key={item.id} className="request-card">
            <div>
              <strong>{item.title}</strong>
              <div>สถานที่: {item.location} | ความสำคัญ: {item.priority} | สถานะ: {item.status}</div>
            </div>
            <button type="button" className="btn-delete" onClick={() => handleDelete(item.id)}>
              ลบ
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}