    function PriorityBadge({ priority }) {
    if (priority === 'urgent') {
        return <span className="badge priority-urgent">เร่งด่วน</span>;
    }
    if (priority === 'normal') {
        return <span className="badge priority-normal">ปกติ</span>;
    }
    return <span className="badge priority-unknown">ไม่ระบุ</span>;
    }

    export default PriorityBadge;