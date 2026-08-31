function PriorityBadge({ priority }) {
  if (priority === 'urgent') {
    return <span className="priority-badge priority-urgent">เร่งด่วน</span>;
  }
  if (priority === 'normal') {
    return <span className="priority-badge priority-normal">ปกติ</span>;
  }
  return <span className="priority-badge priority-unknown">ไม่ระบุ</span>;
}

export default PriorityBadge;