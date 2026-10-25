import {useState} from 'react'
import "../style/home.scss"
import { useInterview } from "../hooks/useInterview"
import { useNavigate } from "react-router"
import { useAuth } from "../../auth/hooks/useAuth.js"

const formatFileSize = (size) => {
    if (size < 1024) return `${size} bytes`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / (1024 * 1024)).toFixed(2)} MB`
}

const Home = () => {

    const { loading, generateReport, reports } = useInterview()
    const { handleLogout } = useAuth()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [logoutError, setLogoutError] = useState("")
    const [resumeFile, setResumeFile] = useState(null)
    const [isDraggingResume, setIsDraggingResume] = useState(false)

    const navigate = useNavigate()

    const handleLogoutClick = async () => {
        setLogoutError("")
        try {
            await handleLogout()
            navigate('/login', { replace: true })
        } catch (error) {
            setLogoutError(error.message)
        }
    }

    const handleGenerateReport = async () => {
        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        navigate(`/interview/${data._id}`)
    }

    const handleResumeDrop = (event) => {
        event.preventDefault()
        setIsDraggingResume(false)
        setResumeFile(event.dataTransfer.files[0] || null)
    }

    if(loading) {
        return (
            <main className="loading-screen">
                <h1>Generating your resume report...</h1>
            </main>
        )
    }


  return (
    <main className="home">
      <div className="home__content">
        <header className="page-heading">
          <button className="logout-button" type="button" onClick={handleLogoutClick}>
            Log out
          </button>
          {logoutError && <p className="logout-error" role="alert">{logoutError}</p>}
          <h1>Create Your Custom <span>Interview Plan</span></h1>
          <p>Let our AI analyze the job requirements and your unique profile to build a<br className="desktop-break" /> winning strategy.</p>
        </header>

        <section className="interview-card" aria-label="Create your interview plan">
          <div className="interview-input-group">
            <div className="form-panel form-panelf--job">
              <label className="section-heading" htmlFor="jobDescription">
                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M7.2 3.2h5.6c.66 0 1.2.54 1.2 1.2v1.1h2.2c.77 0 1.4.63 1.4 1.4v8.7c0 .77-.63 1.4-1.4 1.4H3.8c-.77 0-1.4-.63-1.4-1.4V6.9c0-.77.63-1.4 1.4-1.4H6V4.4c0-.66.54-1.2 1.2-1.2ZM7.6 5.5h4.8v-.8H7.6v.8Z"/></svg>
                <span>Target Job Description</span>
                <small className="required-badge">Required</small>
              </label>
              <div className="job-textarea-wrap">
                <textarea
               
                onChange={(e) => { setJobDescription(e.target.value) }}

                  name="jobDescription"
                  id="jobDescription"
                  maxLength={5000}
                  placeholder={"Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"}
                />
                <span className="character-count" aria-label="0 of 5000 characters">0 / 5000 chars</span>
              </div>
            </div>

            <div className="form-panel form-panel--profile">
              <h2 className="section-heading">
                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM3.2 16.3c.5-2.65 3.02-4.3 6.8-4.3s6.3 1.65 6.8 4.3c.12.64-.42 1.2-1.07 1.2H4.27c-.65 0-1.2-.56-1.07-1.2Z"/></svg>
                <span>Your Profile</span>
              </h2>

              <div className="profile-fields">
                <div className="upload-field">
                  <label className="field-label" htmlFor="resume">Upload Resume <span>(Best Results)</span></label>
                  <label
                    className={`upload-box${isDraggingResume ? ' is-dragging' : ''}`}
                    htmlFor="resume"
                    onDragEnter={(event) => {
                      event.preventDefault()
                      setIsDraggingResume(true)
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDragLeave={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget)) {
                        setIsDraggingResume(false)
                      }
                    }}
                    onDrop={handleResumeDrop}
                  >
                    <span className="upload-box__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.7 10.1A6.8 6.8 0 0 0 5.4 8.5 4.9 4.9 0 0 0 6 18.3h12.5a4.1 4.1 0 0 0 .2-8.2ZM13 16h-2v-3.2H8.8l3.2-3.3 3.2 3.3H13V16Z"/></svg></span>
                    {resumeFile ? (
                      <>
                        <strong className="upload-box__file-name" title={resumeFile.name} aria-live="polite">{resumeFile.name}</strong>
                        <small>{formatFileSize(resumeFile.size)} · Click or drop to replace</small>
                      </>
                    ) : (
                      <>
                        <strong>Click to upload or drag &amp; drop</strong>
                        <small>PDF or DOCX (Max 5MB)</small>
                      </>
                    )}
                  </label>
                  <input
                    className="visually-hidden"
                    type="file"
                    name="resume"
                    id="resume"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(event) => setResumeFile(event.target.files[0] || null)}
                  />
                </div>

                <div className="or-divider" aria-hidden="true"><span>OR</span></div>

                <div className="description-field">
                  <label className="field-label" htmlFor="selfDescription">Quick Self-Description</label>
                  <textarea
                  onChange={(e) => setSelfDescription(e.target.value)}
                    className="self-description"
                    name="selfDescription"
                    id="selfDescription"
                    placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                  />
                </div>

                <div className="info-banner">
                  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM8 4.3a.85.85 0 1 1 0 1.7.85.85 0 0 1 0-1.7Zm1 7H7V7.6h2v3.7Z"/></svg>
                  <p>Either a <strong>Resume</strong> or a <strong>Self-Description</strong> is required to generate a personalized plan.</p>
                </div>
              </div>
            </div>
          </div>

          <footer className="card-footer">
            <p>AI-Powered Strategy Generation <span>•</span> Approx 30s</p>
            <button
            onClick={handleGenerateReport}
             className="button primary-button generate-button" type="button">
              <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m10 1.7 1.55 4.75 4.75 1.55-4.75 1.55L10 14.3l-1.55-4.75L3.7 8l4.75-1.55L10 1.7ZM16.1 12.8l.78 2.32 2.32.78-2.32.78-.78 2.32-.78-2.32L13 15.9l2.32-.78.78-2.32ZM4 11l.68 2.02 2.02.68-2.02.68L4 16.4l-.68-2.02L1.3 13.7l2.02-.68L4 11Z"/></svg>
              Generate My Interview Strategy
            </button>
          </footer>
        </section>

        {/* Recent Reports List */}
         {reports.length > 0 && (
                <section className='recent-reports'>
                    <h2>My Recent Interview Plans</h2>
                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                <h3>{report.title || 'Untitled Position'}</h3>
                                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

        <nav className="page-footer" aria-label="Support and legal">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#help">Help Center</a>
        </nav>
      </div>
    </main>
  )
}

export default Home
