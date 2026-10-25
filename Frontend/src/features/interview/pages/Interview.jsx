import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router'
import "../style/interview.scss"
import { useInterview } from "../hooks/useInterview"
import { useNavigate, useParams } from 'react-router'




const sections = [
  { id: 'technical', label: 'Technical questions', icon: '01' },
  { id: 'behavioral', label: 'Behavioral questions', icon: '02' },
  { id: 'roadmap', label: 'Road Map', icon: '03' }
]

const Interview = ({ data: suppliedData, interviewData: suppliedInterviewData }) => {
  const location = useLocation()
  const [activeSection, setActiveSection] = useState('technical')

  const { report, getReportById, loading, getResumePdf } = useInterview()
  const { interviewId } = useParams()

   useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [ interviewId ])

    if (loading || !report) {
      return (
      <main className='loading-screen'>
        <h1>Downloading your personalized resume...</h1>
        </main>

        )
    }
    


  const interview = suppliedData || suppliedInterviewData || location.state?.interviewData || report
  const technicalQuestions = interview.technicalQuestions || []
  const behavioralQuestions = interview.behavioralQuestions || []
  const skillGaps = interview.skillGaps || []
  const preparationPlan = interview.preparationPlan || []

  const renderQuestions = (questions, type) => (
    <div className="question-list">
      {questions.length ? questions.map((item, index) => (
        <article className="question-card" key={`${type}-${index}`}>
          <div className="question-card__topline">
            <span className="question-card__number">QUESTION {String(index + 1).padStart(2, '0')}</span>
            <span className={`question-card__type question-card__type--${type}`}>{type}</span>
          </div>
          <h3>{item.question}</h3>
          {item.intention && <div className="question-detail question-detail--intention"><span className="detail-label">WHAT THEY’RE LOOKING FOR</span><p>{item.intention}</p></div>}
          {item.answer && <div className="question-detail"><span className="detail-label">SUGGESTED ANSWER</span><p>{item.answer}</p></div>}
        </article>
      )) : <div className="empty-state">No {type} questions are available yet.</div>}
    </div>
  )

  const renderMainContent = () => {
    if (activeSection === 'behavioral') {
      return <><div className="content-heading"><span className="content-heading__eyebrow">YOUR INTERVIEW PREP</span><h1>Behavioral <span>Questions</span></h1><p>Practice clear, specific stories that show how you work with people and solve challenges.</p></div>{renderQuestions(behavioralQuestions, 'behavioral')}</>
    }

    if (activeSection === 'roadmap') {
      return <><div className="content-heading"><span className="content-heading__eyebrow">A PLAN BUILT FOR YOU</span><h1>Your prep <span>road map</span></h1><p>Seven focused days to close gaps and feel ready for the conversation.</p></div><div className="roadmap-list">{preparationPlan.length ? preparationPlan.map((day) => <article className="roadmap-card" key={day._id || day.day}><span className="roadmap-card__day">DAY {day.day}</span><div className="roadmap-card__body"><h3>{day.focus}</h3><ul>{(day.tasks || []).map((task, index) => <li key={index}>{task}</li>)}</ul></div></article>) : <div className="empty-state">No preparation plan is available yet.</div>}</div></>
    }

    return <><div className="content-heading"><span className="content-heading__eyebrow">YOUR INTERVIEW PREP</span><h1>Technical <span>Questions</span></h1><p>Role-specific questions with guidance to help you shape a confident answer.</p></div>{renderQuestions(technicalQuestions, 'technical')}</>
  }



  return (
    <main className="interview-page">
      <div className="interview-layout">
        <aside className="interview-sidebar" aria-label="Interview report sections">
          <a href="/" className="interview-brand"><span className="interview-brand__mark" aria-hidden="true">✦</span><span>interview<span>AI</span></span></a>
          <div className="sidebar-caption">YOUR REPORT</div>

          <nav className="section-nav">
            {sections.map((section) => (
              <button
                className={`section-nav__item${activeSection === section.id ? ' is-active' : ''}`}
                key={section.id}
                type="button"
                aria-current={activeSection === section.id ? 'page' : undefined}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="section-nav__number">{section.icon}</span>
                <span>{section.label}</span>
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m6 3.5 4.5 4.5L6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            ))}
          </nav>

          <div className="sidebar-score"><span className="sidebar-score__label">PROFILE MATCH</span><strong>{interview.matchScore ?? '—'}<small>{interview.matchScore != null ? '%' : ''}</small></strong><span className="sidebar-score__note">Your experience alignment</span></div>
          <a href="/" className="back-link"><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10.5 3.5 6 8l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> Back to dashboard</a>
        </aside>

        <section className="interview-main" aria-live="polite">
          <header className="main-topbar"><span className="main-topbar__mobile-brand">interview<span>AI</span></span><span className="report-status"><i /> REPORT READY</span></header>
          <div className="main-content">{renderMainContent()}</div>
        </section>

        <aside className="skill-sidebar" aria-labelledby="skill-gaps-title">
        
          <div className="skill-sidebar__header"><span className="skill-sidebar__icon" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none"><path d="M10 2.5v3m0 9v3m7.5-7.5h-3m-9 0h-3m12.8-5.3-2.1 2.1m-6.4 6.4-2.1 2.1m10.6 0-2.1-2.1m-6.4-6.4L5.1 3.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="10" cy="10" r="3.2" stroke="currentColor" strokeWidth="1.4"/></svg></span><div><span className="skill-sidebar__eyebrow">FOCUS AREAS</span><h2 id="skill-gaps-title">Skill Gaps</h2></div></div>
          <p className="skill-sidebar__description">Topics to strengthen before your interview.</p>
          <div className="skill-list">
            {skillGaps.length ? skillGaps.map((gap, index) => <article className="skill-item" key={`${gap.skill}-${index}`}><div className="skill-item__top"><span className={`severity-dot severity-dot--${(gap.severity || 'medium').toLowerCase()}`} /><span className={`severity-label severity-label--${(gap.severity || 'medium').toLowerCase()}`}>{gap.severity || 'medium'} priority</span></div><p>{gap.skill}</p></article>) : <p className="skill-empty">No skill gaps were identified.</p>}
          </div>
          <div className="skill-tip"><span aria-hidden="true">✦</span><p>Start with high priority areas, then work through your roadmap one day at a time.</p></div>

          <div className="resume-download-container">
            <button
              onClick={() => getResumePdf(interviewId)}
              className="button primary-button"
            >
              <svg
                height="0.8rem"
                style={{ marginRight: "0.8rem" }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 16.9698 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 18.5722L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z" />
              </svg>Download Resume
            </button>
          </div>
        </aside>
        <aside className="interview-sidebar" aria-label="Interview report sections"></aside>

      </div>
      
    </main>
  )
}

export default Interview
