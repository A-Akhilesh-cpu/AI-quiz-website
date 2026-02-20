import { useState, useEffect } from 'react';
import {
    HiPlus,
    HiPencilSquare,
    HiTrash,
    HiCheck,
    HiXMark,
    HiAcademicCap,
    HiChevronDown,
    HiChevronUp,
} from 'react-icons/hi2';
import { getAllQuestions, saveQuestions } from '../data/questions';
import './Admin.css';

const emptyQuestion = {
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
};

export default function Admin() {
    const [allQuestions, setAllQuestions] = useState({});
    const [selectedSubject, setSelectedSubject] = useState('');
    const [editingQuestion, setEditingQuestion] = useState(null); // index or 'new'
    const [formData, setFormData] = useState({ ...emptyQuestion });
    const [newSubject, setNewSubject] = useState('');
    const [showNewSubject, setShowNewSubject] = useState(false);
    const [expandedSubjects, setExpandedSubjects] = useState({});

    useEffect(() => {
        setAllQuestions(getAllQuestions());
    }, []);

    const subjects = Object.keys(allQuestions);

    const toggleSubject = (subject) => {
        setExpandedSubjects(prev => ({
            ...prev,
            [subject]: !prev[subject],
        }));
        setSelectedSubject(subject);
    };

    const handleAddSubject = () => {
        if (newSubject.trim() && !allQuestions[newSubject.trim()]) {
            const updated = { ...allQuestions, [newSubject.trim()]: [] };
            setAllQuestions(updated);
            saveQuestions(newSubject.trim(), []);
            setSelectedSubject(newSubject.trim());
            setExpandedSubjects(prev => ({ ...prev, [newSubject.trim()]: true }));
            setNewSubject('');
            setShowNewSubject(false);
        }
    };

    const handleEdit = (subject, index) => {
        setSelectedSubject(subject);
        setEditingQuestion(index);
        const q = allQuestions[subject][index];
        setFormData({
            question: q.question,
            options: [...q.options],
            correctAnswer: q.correctAnswer,
        });
    };

    const handleNew = (subject) => {
        setSelectedSubject(subject);
        setEditingQuestion('new');
        setFormData({ ...emptyQuestion, options: ['', '', '', ''] });
    };

    const handleSave = () => {
        if (!formData.question.trim() || formData.options.some(o => !o.trim())) {
            return;
        }

        const subjectQuestions = [...(allQuestions[selectedSubject] || [])];

        if (editingQuestion === 'new') {
            subjectQuestions.push({
                id: subjectQuestions.length + 1,
                question: formData.question,
                options: formData.options,
                correctAnswer: formData.correctAnswer,
            });
        } else {
            subjectQuestions[editingQuestion] = {
                ...subjectQuestions[editingQuestion],
                question: formData.question,
                options: formData.options,
                correctAnswer: formData.correctAnswer,
            };
        }

        saveQuestions(selectedSubject, subjectQuestions);
        setAllQuestions(prev => ({ ...prev, [selectedSubject]: subjectQuestions }));
        setEditingQuestion(null);
        setFormData({ ...emptyQuestion });
    };

    const handleDelete = (subject, index) => {
        if (!confirm('Delete this question?')) return;
        const subjectQuestions = [...allQuestions[subject]];
        subjectQuestions.splice(index, 1);
        saveQuestions(subject, subjectQuestions);
        setAllQuestions(prev => ({ ...prev, [subject]: subjectQuestions }));
    };

    const handleCancel = () => {
        setEditingQuestion(null);
        setFormData({ ...emptyQuestion });
    };

    const handleOptionChange = (index, value) => {
        const options = [...formData.options];
        options[index] = value;
        setFormData(prev => ({ ...prev, options }));
    };

    return (
        <div className="admin-page page-wrapper">
            <div className="container admin-container">
                <div className="admin-header animate-slide-down">
                    <div>
                        <h1 className="admin-title">
                            <HiAcademicCap /> Question Manager
                        </h1>
                        <p className="admin-subtitle">Add, edit, and manage quiz questions</p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowNewSubject(!showNewSubject)}
                    >
                        <HiPlus /> New Subject
                    </button>
                </div>

                {/* New Subject Form */}
                {showNewSubject && (
                    <div className="new-subject-form glass-card animate-fade-in">
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Enter subject name..."
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
                        />
                        <button className="btn btn-success btn-sm" onClick={handleAddSubject}>
                            <HiCheck /> Add
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setShowNewSubject(false)}>
                            <HiXMark />
                        </button>
                    </div>
                )}

                {/* Question Editor Modal */}
                {editingQuestion !== null && (
                    <div className="editor-overlay animate-fade-in" onClick={handleCancel}>
                        <div className="editor-modal glass-card animate-scale-in" onClick={e => e.stopPropagation()}>
                            <h3 className="editor-title">
                                {editingQuestion === 'new' ? 'Add New Question' : 'Edit Question'}
                            </h3>

                            <div className="editor-form">
                                <div className="input-group">
                                    <label className="input-label">Question</label>
                                    <textarea
                                        className="input-field textarea"
                                        placeholder="Enter question text..."
                                        value={formData.question}
                                        onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                                        rows={3}
                                    />
                                </div>

                                {formData.options.map((option, idx) => (
                                    <div key={idx} className="option-input-row">
                                        <label
                                            className={`option-radio ${formData.correctAnswer === idx ? 'selected' : ''}`}
                                            title="Mark as correct answer"
                                        >
                                            <input
                                                type="radio"
                                                name="correctAnswer"
                                                checked={formData.correctAnswer === idx}
                                                onChange={() => setFormData(prev => ({ ...prev, correctAnswer: idx }))}
                                            />
                                            <span className="radio-visual">
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                            value={option}
                                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                                        />
                                    </div>
                                ))}

                                <p className="editor-hint">
                                    Click the letter circle to mark the correct answer
                                </p>

                                <div className="editor-actions">
                                    <button className="btn btn-primary" onClick={handleSave}>
                                        <HiCheck /> Save Question
                                    </button>
                                    <button className="btn btn-secondary" onClick={handleCancel}>
                                        <HiXMark /> Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Subject Accordions */}
                <div className="subjects-list">
                    {subjects.map(subject => (
                        <div key={subject} className="subject-group glass-card animate-slide-up">
                            <button
                                className="subject-header"
                                onClick={() => toggleSubject(subject)}
                            >
                                <div className="subject-info">
                                    <HiAcademicCap className="subject-icon" />
                                    <span className="subject-name">{subject}</span>
                                    <span className="badge badge-primary">
                                        {(allQuestions[subject] || []).length} questions
                                    </span>
                                </div>
                                {expandedSubjects[subject] ? <HiChevronUp /> : <HiChevronDown />}
                            </button>

                            {expandedSubjects[subject] && (
                                <div className="subject-content animate-fade-in">
                                    {(allQuestions[subject] || []).map((q, idx) => (
                                        <div key={idx} className="question-row">
                                            <div className="question-row-content">
                                                <span className="question-row-num">Q{idx + 1}.</span>
                                                <span className="question-row-text">{q.question}</span>
                                            </div>
                                            <div className="question-row-actions">
                                                <button
                                                    className="icon-btn edit"
                                                    onClick={() => handleEdit(subject, idx)}
                                                    title="Edit"
                                                >
                                                    <HiPencilSquare />
                                                </button>
                                                <button
                                                    className="icon-btn delete"
                                                    onClick={() => handleDelete(subject, idx)}
                                                    title="Delete"
                                                >
                                                    <HiTrash />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        className="btn btn-secondary add-question-btn"
                                        onClick={() => handleNew(subject)}
                                    >
                                        <HiPlus /> Add Question
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {subjects.length === 0 && (
                    <div className="empty-state glass-card">
                        <span className="empty-icon">📚</span>
                        <h3>No Subjects Yet</h3>
                        <p>Create a new subject to start adding questions.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
