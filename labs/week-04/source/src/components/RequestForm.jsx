import { useState } from 'react';

const initialFormData = {
  requesterName: '',
  requestType: '',
  location: '',
  details: '',
  priority: 'normal',
};

// LAB4-R06: validate ทุก field แยกเป็น error object ต่อ field
function validateRequests(formData) {
  const error = {};

  if(formData.requesterName.trim().length < 3 ) {
    error.requesterName = "กรุณาระบุชื่อนักศึกษาอย่างน้อย 3 ตัวอักษร" 
  }

  if(!formData.requestType) {
    error.requestType = 'กรุณาเลือกประเภทคำร้องขอ' ;
  }

  if(formData.details.trim().length < 10) {
    error.details = 'กรุณาเขียนคำอธิบาย 10 คำขึ้นไป' ;
  }
  
  if(formData.location.trim().length < 5) { 
    error.location = 'ห้ามกรอกสถานที่ต่ำกว่า 5 ตัวอักษร'
  }

  return error;

}

//LAB4-R05 ทุก field เป็น Controlled Form
function RequestForm({ onAddRequest }) {

  const [formData , setFormData] = useState(initialFormData);
  const [errors , setErrors] = useState({});
  const [feedback , setFeedBack] = useState('');

  function handleChange(event) {
    const {name , value} = event.target;
    setFormData((current) => ({ ...current , [name]: value}));
    setErrors((current) => ({... current , [name]: ''}));
    setFeedBack('');
  }



  function handleSubmit(event) {
    event.preventDefault();
    // TODO LAB4-R05–R07: validate controlled state แล้วเรียก onAddRequest
    const nextErrors = validateRequests(formData);
    setErrors(nextErrors);

    if(Object.keys(nextErrors).length > 0) {
      setFeedBack('ไม่สามารถเพิ่มคำร้องขอได้กรุณาตรวจคำร้องขอ');
      return;
    }
    //LAB4-R07 valid submit เพิ่ม pending request แบบ immutable และ reset
    onAddRequest({
      ...formData ,
      requesterName: formData.requesterName.trim(),
      location: formData.location.trim(),
      details: formData.details.trim(),
    });
    // reset from;
    setFormData(initialFormData);
    setFeedBack('เพิ่มคำร้องขอของคุณเรียบร้อยแล้ว')
  }

  return (
 <section className="panel" aria-labelledby="request-form-title">
  <p className="eyebrow dark">CONTROLLED FORM</p>
  <h2 id="request-form-title">สร้างคำร้องใหม่</h2>
  <form onSubmit={handleSubmit} noValidate>
    <div className="field">
      <label htmlFor="requesterName">ชื่อผู้แจ้ง</label>
      <input
        id="requesterName"
        name="requesterName"
        value={formData.requesterName}
        onChange={handleChange}
        aria-invalid={Boolean(errors.requesterName)}
        aria-describedby="requesterName-error"
      />
      <small className="error" id="requesterName-error">
        {errors.requesterName}
      </small>
    </div>

    <div className="field">
      <label htmlFor="requestType">ประเภทคำร้อง</label>
      <select
        id="requestType"
        name="requestType"
        value={formData.requestType}
        onChange={handleChange}
        aria-invalid={Boolean(errors.requestType)}
        aria-describedby="requestType-error"
      >
        <option value="">-- เลือกประเภท --</option>
        <option value="แจ้งซ่อม">แจ้งซ่อม</option>
        <option value="ขอใช้ห้อง">ขอใช้ห้อง</option>
        <option value="บริการบัญชีผู้ใช้">บริการบัญชีผู้ใช้</option>
      </select>
      <small className="error" id="requestType-error">
        {errors.requestType}
      </small>
    </div>

    <div className="field">
      <label htmlFor="location">สถานที่</label>
      <input
        id="location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        aria-invalid={Boolean(errors.location)}
        aria-describedby="location-error"
      />
      <small className="error" id="location-error">
        {errors.location}
      </small>
    </div>

    <div className="field">
      <label htmlFor="details">รายละเอียด</label>
      <textarea
        id="details"
        name="details"
        rows="4"
        value={formData.details}
        onChange={handleChange}
        aria-invalid={Boolean(errors.details)}
        aria-describedby="details-error"
      />
      <small className="error" id="details-error">
        {errors.details}
      </small>
    </div>

    <fieldset className="field">
      <legend>ความเร่งด่วน</legend>
      <label>
        <input
          type="radio"
          name="priority"
          value="normal"
          checked={formData.priority === 'normal'}
          onChange={handleChange}
        />{' '}
        ปกติ
      </label>
      <label>
        <input
          type="radio"
          name="priority"
          value="urgent"
          checked={formData.priority === 'urgent'}
          onChange={handleChange}
        />{' '}
        เร่งด่วน
      </label>
    </fieldset>

    <button type="submit">เพิ่มคำร้อง</button>
    <p className="status" role="status">{feedback}</p>
  </form>
</section>
  );
}

export default RequestForm;