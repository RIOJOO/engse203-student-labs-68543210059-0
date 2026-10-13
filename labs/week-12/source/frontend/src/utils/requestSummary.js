/**
 * สรุปจำนวนคำร้องตามสถานะ
 */
export function summarizeRequests(requests = []) {
  if (!Array.isArray(requests)) {
    return { total: 0, pending: 0, inProgress: 0, completed: 0 };
  }
  const count = (status) => requests.filter((r) => r.status === status).length;
  return {
    total: requests.length,
    pending: count('pending'),
    inProgress: count('in-progress'),
    completed: count('completed'),
  };
}
