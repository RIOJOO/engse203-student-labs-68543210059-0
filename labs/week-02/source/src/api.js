export async function fetchTasks() {
  const urlParams = new URLSearchParams(window.location.search);
  const simulateError = urlParams.get('simulateError') === '1';

  const baseUrl = import.meta.env.BASE_URL || './';
  const targetUrl = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}data/learning-tasks.json`;

  if (simulateError) {
    throw new Error('เกิดข้อผิดพลาดในการโหลดข้อมูล (จำลองข้อผิดพลาด ?simulateError=1)');
  }

  const response = await fetch(targetUrl);
  if (!response.ok) {
    throw new Error(`ไม่สามารถโหลดข้อมูลได้: HTTP ${response.status}`);
  }

  return await response.json();
}