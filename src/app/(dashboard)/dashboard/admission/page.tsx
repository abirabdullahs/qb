'use client';

import { useState, useEffect } from 'react';
import { Building2, Plus, Sparkles, Layers, ShieldCheck } from 'lucide-react';

interface AdmissionSegment {
  id: number;
  name: string;
  code?: string;
}

interface Institute {
  id: number;
  admissionSegmentId: number;
  name: string;
  shortName?: string;
  location?: string;
}

interface AdmissionUnit {
  id: number;
  admissionExamId: number;
  unitName: string;
  description?: string;
}

interface AdmissionExam {
  id: number;
  admissionSegmentId: number;
  name: string;
  examYear: number;
  conductingBody?: string;
  examType: 'single_institute' | 'cluster' | 'centralized';
  instituteId?: number | null;
  negativeMarking?: number | string | null;
  units?: AdmissionUnit[];
}

export default function AdmissionAdminPage() {
  const [segments, setSegments] = useState<AdmissionSegment[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [exams, setExams] = useState<AdmissionExam[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states - Institute
  const [instSegmentId, setInstSegmentId] = useState<number | ''>('');
  const [instName, setInstName] = useState('');
  const [instShortName, setInstShortName] = useState('');
  const [instLocation, setInstLocation] = useState('');

  // Form states - Exam
  const [examSegmentId, setExamSegmentId] = useState<number | ''>('');
  const [examName, setExamName] = useState('');
  const [examYear, setExamYear] = useState<number>(2026);
  const [conductingBody, setConductingBody] = useState('');
  const [examType, setExamType] = useState<'single_institute' | 'cluster' | 'centralized'>('single_institute');
  const [examInstituteId, setExamInstituteId] = useState<number | ''>('');
  const [negativeMarking, setNegativeMarking] = useState<number>(0.25);

  // Form states - Unit
  const [selectedExamId, setSelectedExamId] = useState<number | ''>('');
  const [unitName, setUnitName] = useState('');
  const [unitDescription, setUnitDescription] = useState('');

  const loadData = async () => {
    try {
      const [segRes, instRes, examRes] = await Promise.all([
        fetch('/api/admission/segments'),
        fetch('/api/admission/institutes'),
        fetch('/api/admission/exams'),
      ]);
      const [segData, instData, examData] = await Promise.all([
        segRes.json(),
        instRes.json(),
        examRes.json(),
      ]);

      if (segData.success) setSegments(segData.data);
      if (instData.success) setInstitutes(instData.data);
      if (examData.success) setExams(examData.data);
    } catch (err) {
      console.error('Failed to load admission admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateInstitute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instSegmentId || !instName.trim()) return;
    try {
      const res = await fetch('/api/admission/institutes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admissionSegmentId: Number(instSegmentId),
          name: instName,
          shortName: instShortName,
          location: instLocation,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setInstName('');
        setInstShortName('');
        setInstLocation('');
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examSegmentId || !examName.trim()) return;
    try {
      const payload = {
        admissionSegmentId: Number(examSegmentId),
        name: examName,
        examYear: Number(examYear),
        conductingBody,
        examType,
        instituteId: examType === 'single_institute' && examInstituteId ? Number(examInstituteId) : null,
        negativeMarking: Number(negativeMarking),
      };

      const res = await fetch('/api/admission/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setExamName('');
        setConductingBody('');
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamId || !unitName.trim()) return;
    try {
      const res = await fetch('/api/admission/units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admissionExamId: Number(selectedExamId),
          unitName,
          description: unitDescription,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUnitName('');
        setUnitDescription('');
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>Admission Exam & Unit Administration</h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Configure Single-Institute (BUET, DU), Cluster Guccho (GST A/B/C), and Centralized Medical (DGHS) exam models.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Exams List Card */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="#10b981" />
            <span>Configured Admission Exams</span>
          </h2>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading exams...</div>
          ) : exams.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No admission exams added yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {exams.map((ex) => {
                const segName = segments.find((s) => s.id === ex.admissionSegmentId)?.name || 'Admission';
                const instName = institutes.find((i) => i.id === ex.instituteId)?.name;

                return (
                  <div key={ex.id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{ex.name}</h3>
                          <span className={`badge ${ex.examType === 'cluster' ? 'badge-primary' : ex.examType === 'centralized' ? 'badge-success' : 'badge-warning'}`}>
                            {ex.examType === 'cluster' ? 'Cluster Exam' : ex.examType === 'centralized' ? 'Centralized (Medical)' : 'Single Institute'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                          Category: <strong>{segName}</strong> | Year: {ex.examYear} | Conducting: {ex.conductingBody || 'N/A'}
                          {instName && <span> | Institute: <strong>{instName}</strong></span>}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#475569', background: '#e2e8f0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        - {ex.negativeMarking || 0.25} Negative Mark
                      </span>
                    </div>

                    {/* Cluster Units if Cluster type */}
                    {ex.examType === 'cluster' && (
                      <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #cbd5e1' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                          Cluster Units (A/B/C):
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {ex.units && ex.units.length > 0 ? (
                            ex.units.map((u) => (
                              <span key={u.id} style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                                <strong>{u.unitName}</strong> {u.description && <span style={{ color: '#64748b' }}>({u.description})</span>}
                              </span>
                            ))
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>No units added to this cluster yet.</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column Action Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Create Exam Form */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={16} color="#2563eb" />
              <span>Create Admission Exam</span>
            </h3>

            <form onSubmit={handleCreateExam}>
              <div className="form-group">
                <label className="form-label">Exam Segment</label>
                <select
                  className="form-select"
                  value={examSegmentId}
                  onChange={(e) => setExamSegmentId(Number(e.target.value))}
                  required
                >
                  <option value="">Select Segment</option>
                  {segments.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Exam Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. GST Guccho 2026 / Medical Admission 2026"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Exam Architecture Type</label>
                <select
                  className="form-select"
                  value={examType}
                  onChange={(e) => setExamType(e.target.value as any)}
                >
                  <option value="single_institute">Single Institute (BUET / DU / CUET)</option>
                  <option value="cluster">Cluster Exam (GST Guccho Unit A/B/C)</option>
                  <option value="centralized">Centralized Nationwide (Medical DGHS)</option>
                </select>
              </div>

              {examType === 'single_institute' && (
                <div className="form-group">
                  <label className="form-label">Owning Institute</label>
                  <select
                    className="form-select"
                    value={examInstituteId}
                    onChange={(e) => setExamInstituteId(Number(e.target.value))}
                    required
                  >
                    <option value="">Select Institute</option>
                    {institutes.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name} ({inst.shortName || 'N/A'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Exam Year</label>
                  <input
                    type="number"
                    className="form-input"
                    value={examYear}
                    onChange={(e) => setExamYear(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Conducting Body</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="BUET / DGHS / GST"
                    value={conductingBody}
                    onChange={(e) => setConductingBody(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Save Admission Exam
              </button>
            </form>
          </div>

          {/* Add Cluster Unit */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={16} color="#9333ea" />
              <span>Add Cluster Unit (A/B/C)</span>
            </h3>

            <form onSubmit={handleCreateUnit}>
              <div className="form-group">
                <label className="form-label">Cluster Exam</label>
                <select
                  className="form-select"
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(Number(e.target.value))}
                  required
                >
                  <option value="">Select Cluster Exam</option>
                  {exams
                    .filter((e) => e.examType === 'cluster')
                    .map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Unit Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="A Unit / B Unit / C Unit"
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Unit Description</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Science Background Applicants"
                  value={unitDescription}
                  onChange={(e) => setUnitDescription(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', background: '#9333ea' }}>
                Add Cluster Unit
              </button>
            </form>
          </div>

          {/* Register Institute */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Building2 size={16} color="#10b981" />
              <span>Register Institute</span>
            </h3>

            <form onSubmit={handleCreateInstitute}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={instSegmentId}
                  onChange={(e) => setInstSegmentId(Number(e.target.value))}
                  required
                >
                  <option value="">Select Category</option>
                  {segments.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Institute Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rajshahi University of Engineering & Technology"
                  value={instName}
                  onChange={(e) => setInstName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Short Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="RUET"
                    value={instShortName}
                    onChange={(e) => setInstShortName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Rajshahi"
                    value={instLocation}
                    onChange={(e) => setInstLocation(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', background: '#10b981' }}>
                Register Institute
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
