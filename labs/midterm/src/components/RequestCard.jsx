import { Link } from 'react-router-dom';

function RequestCard({ request, onDeleteRequest, onMarkDone }) {
  return (
    <article className="request-card">
      <div>
        <p className="request-id">{request.id}</p>
        <h3><Link to={`/requests/${request.id}`}>{request.requestType}</Link></h3>
        <p>{request.location}</p>
        <p>{request.details}</p>
        {/* TODO B4: แทน {request.priority} ด้านล่างด้วย <PriorityBadge priority={request.priority} /> ที่คุณสร้าง */}
        <p><span className={`badge ${request.status}`}>{request.status}</span> · {request.priority}</p>
      </div>

      <div className="card-actions">
        {request.status !== 'completed' && (
          <button
            type="button"
            className="button secondary"
            onClick={() => onMarkDone?.(request.id)}
          >
            ทำเสร็จ
          </button>
        )}

        <button
          type="button"
          className="button danger"
          onClick={() => onDeleteRequest(request.id)}
          aria-label={`ลบคำร้อง ${request.id}`}
        >
          ลบ
        </button>
      </div>
    </article>
  );
}

export default RequestCard;