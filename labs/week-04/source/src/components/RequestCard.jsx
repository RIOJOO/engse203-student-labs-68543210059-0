const statusLabels = {
  pending: 'รอดำเนินการ',
  'in-progress': 'กำลังดำเนินการ',
  completed: 'เสร็จสิ้น',
};

function RequestCard({ request, onDeleteRequest }) {
  return (
    <article className="request-card">
      <div>
        <div className="badge-row">
          <span className={`badge status-${request.status}`}>
            {statusLabels[request.status]}
          </span>
          {request.priority === 'urgent' && (
            <span className="badge priority-urgent">เร่งด่วน</span>
          )}
        </div>
        <p className="request-id">{request.id}</p>
        <h3>{request.requestType}</h3>
        <p>{request.location}</p>
        <p>{request.details}</p>
      </div>
      <button
        className="danger-button"
        type="button"
        onClick={() => onDeleteRequest(request.id)}
        aria-label={`ลบคำร้อง ${request.id}`}
      >
        ลบ
      </button>
    </article>
  );
}

export default RequestCard;