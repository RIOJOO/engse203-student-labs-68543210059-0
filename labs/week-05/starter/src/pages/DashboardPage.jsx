import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import FilterBar from '../components/FilterBar.jsx';
import RequestList from '../components/RequestList.jsx';
import SummaryPanel from '../components/SummaryPanel.jsx';
import useManualReload from '../hooks/useManualReload.js';
import { getRequests } from '../services/requestService.js';

function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const scenario = searchParams.get('scenario') ?? '';
  const [reloadKey, reload] = useManualReload();

  const [loadState, setLoadState] = useState('idle');
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
  setLoadState('loading');
  setErrorMessage('');
  setNotice('');

  getRequests({ scenario })
    .then((data) => {
      setRequests(data);
      setLoadState('success');
    })
    .catch((error) => {
      setErrorMessage(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
      setLoadState('error');
    });
  // TODO 5B: เพิ่ม cleanup guard เพื่อกัน stale update
}, [scenario, reloadKey]);

  const summary = useMemo(() => ({
    total: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    inProgress: requests.filter((r) => r.status === 'in-progress').length,
    completed: requests.filter((r) => r.status === 'completed').length,
}), [requests]);

const filteredRequests = statusFilter === 'all'
    ? requests
    : requests.filter((request) => request.status === statusFilter);

  async function handleAdd(input) {
    setRequests((current) => [...current, { ...input, id: `REQ-W4-${Date.now()}`, status: 'pending' }]);
    setNotice('เพิ่มคำร้องในหน่วยความจำแล้ว — กด refresh แล้วจะหาย นี่คือโจทย์ของคาบ 5B');
  }

  // คาบ 5A ลบได้เฉพาะในหน่วยความจำ — refresh แล้วกลับมาเหมือนเดิม
// TODO 5B-CP04a: เปลี่ยนเป็น await deleteRequest(requestId) เพื่อให้ลบแล้วหายจริง
  function handleDelete(requestId) {
    setRequests((current) => current.filter((request) => request.id !== requestId));
    setNotice(`ลบคำร้อง ${requestId} ในหน่วยความจำแล้ว — refresh จะกลับมา`);
}

  return (
    <section data-testid="page-dashboard">
      <div className="page-heading">
        <div>
          <p className="eyebrow dark">CP01 · PAGE REFACTOR</p>
          <h1>Campus Service Request</h1>
          <p>ตรวจ add, filter, delete และ validation ว่ายังทำงานเหมือนเดิม</p>
        </div>
      </div>

      {scenario && <p className="lab-scenario" role="status">LAB test scenario: {scenario}</p>}
      {notice && <p className="notice" role="status">{notice}</p>}

      {loadState === 'loading' && <LoadingState />}
      {loadState === 'error' && <ErrorState message={errorMessage} onRetry={handleRetry} />}

      {loadState === 'success' && requests.length === 0 && (
        <section className="state-card" data-testid="empty-state">
          <h2>ยังไม่มีคำร้อง</h2>
          <p>เริ่มสร้างคำร้องแรกของคุณได้เลย</p>
          <Link className="button primary inline" to="/requests/new">สร้างคำร้องใหม่</Link>
        </section>
      )}

      {loadState === 'success' && requests.length > 0 && (
        <>
    … SummaryPanel และ RequestList ที่เขียนไว้แล้ว …
  </>
)}

      {notice && <p className="notice" role="status">{notice}</p>}

      <SummaryPanel summary={summary} />

      <div className="workspace-grid">
        <section className="panel form-panel">
          <RequestForm onAddRequest={handleAdd} />
        </section>
        <section className="panel" aria-labelledby="request-list-title">
          <div className="section-heading">
            <h2 id="request-list-title">รายการคำร้อง</h2>
            <FilterBar value={statusFilter} onFilterChange={setStatusFilter} />
          </div>
          <RequestList requests={filteredRequests} onDeleteRequest={handleDelete} />
        </section>
      </div>
    </section>
  );
}

export default DashboardPage;