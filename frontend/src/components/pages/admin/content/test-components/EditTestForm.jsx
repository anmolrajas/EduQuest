// EditTestForm.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Settings, CheckCircle, Info, Target } from 'lucide-react';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import subjectService from '../../../../../service/subjectService';
import topicService from '../../../../../service/topicService';
import testService from '../../../../../service/testService';

const EditTestForm = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState({
    title: '',
    description: '',
    duration: '',
    type: 'practice',
    subjectId: '',
    topicId: '',
    allowNegativeMarking: false,
    negativeMarks: { easy: 1, medium: 2, hard: 3 },
    marks: { easy: '', medium: '', hard: '' },
    questionCounts: { easy: '', medium: '', hard: '' },
  });
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const tabs = [
    { id: 0, label: 'Basic Info', icon: Info },
    { id: 1, label: 'Questions', icon: Target },
    { id: 2, label: 'Settings', icon: Settings }
  ];
  const testTypes = [
    { value: 'practice', label: 'Practice' },
    { value: 'mock', label: 'Mock Test' },
    { value: 'assignment', label: 'Assignment' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'exam', label: 'Exam' }
  ];

  const totalMarks =
    form.marks.easy * form.questionCounts.easy +
    form.marks.medium * form.questionCounts.medium +
    form.marks.hard * form.questionCounts.hard;

  const totalQuestions =
    form.questionCounts.easy + form.questionCounts.medium + form.questionCounts.hard;

  const handleInput = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedInput = (parent, field, value) => {
    setForm((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const fetchTestDetails = async () => {
    try {
      const res = await testService.getTestById(testId);
      if (res.success) {
        const data = res.data;
        setForm({
          title: data.title,
          description: data.description,
          duration: data.duration,
          type: data.type,
          subjectId: data.subjectId._id,
          topicId: data.topicIds[0]._id,
          allowNegativeMarking: data.allowNegativeMarking,
          negativeMarks: data.negativeMarks,
          marks: data.marks,
          questionCounts: data.questionCounts,
        });
      } else {
        toast.error('Failed to load test details.');
      }
    } catch (error) {
      toast.error('Error fetching test details.');
    }
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...form,
        totalMarks,
        totalQuestions,
      };
      const res = await testService.editTest(testId, payload);
      if (res.success) {
        toast.success('Test updated successfully!');
        setTimeout(() => navigate(-1), 1500);
      } else {
        toast.error('Failed to update test.');
      }
    } catch (error) {
      toast.error('Error updating test.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchTestDetails();
    subjectService.getSubjectNames().then((res) => {
      if (res.success) setSubjects(res.data);
    });
  }, [testId]);

  useEffect(() => {
    if (form.subjectId) {
      topicService.getTopicNames(form.subjectId).then((res) => {
        if (res.success) setTopics(res.data);
      });
    }
  }, [form.subjectId]);

  // The layout and rendering logic should match CreateTestForm, with `Create` button changed to `Update Test`
  // and handleSubmit replaced by handleUpdate

  return (
      <div className="min-h-screen bg-gray-50 p-4">
          <div className="max-w-4xl mx-auto">

              {/* Header */}
              <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm p-6 mb-6 flex justify-between items-center"
              >
                  {/* Left Side: Icon and Title */}
                  <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                          <h1 className="text-2xl font-bold text-gray-900">Edit Test</h1>
                          <p className="text-gray-600">Set up your test parameters</p>
                      </div>
                  </div>

                  {/* Right Side: Back to Dashboard Button */}
                  <button
                      onClick={() => navigate(-1)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-sm font-medium"
                  >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Dashboard
                  </button>
              </motion.div>


              {/* Tabs Navigation */}
              <div className="bg-white rounded-lg shadow-sm mb-6">
                  <div className="flex overflow-x-auto">
                      {tabs.map((tab) => (
                          <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className={`flex-1 min-w-0 px-4 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id
                                  ? 'text-blue-600 border-blue-600 bg-blue-50'
                                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                                  }`}
                          >
                              <tab.icon className="w-4 h-4" />
                              <span className="hidden sm:inline">{tab.label}</span>
                          </button>
                      ))}
                  </div>
              </div>

              {/* Tab Content */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                  <AnimatePresence mode="wait">

                      {/* Basic Info Tab */}
                      {activeTab === 0 && (
                          <motion.div
                              key="basic"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-6"
                          >
                              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                          Test Title
                                      </label>
                                      <input
                                          type="text"
                                          value={form.title}
                                          onChange={(e) => handleInput('title', e.target.value)}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                          placeholder="Enter test title"
                                      />
                                  </div>

                                  <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                          Duration (minutes)
                                      </label>
                                      <input
                                          type="number"
                                          value={form.duration}
                                          onChange={(e) => handleInput('duration', Number(e.target.value))}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                          placeholder="60"
                                      />
                                  </div>
                              </div>

                              <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Test Type
                                  </label>
                                  <select
                                      value={form.type}
                                      onChange={(e) => handleInput('type', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  >
                                      {testTypes.map((type) => (
                                          <option key={type.value} value={type.value}>
                                              {type.label}
                                          </option>
                                      ))}
                                  </select>
                              </div>


                              <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Subject *</label>
                                  <select
                                      value={form.subjectId}
                                      onChange={(e) => handleInput('subjectId', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                  >
                                      <option value="">-- Select Subject --</option>
                                      {subjects.map((subj) => (
                                          <option key={subj._id} value={subj._id}>{subj.name}</option>
                                      ))}
                                  </select>
                              </div>

                              <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Topic *</label>
                                  <select
                                      value={form.topicId}
                                      onChange={(e) => handleInput('topicId', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                      disabled={!form.subjectId}
                                  >
                                      <option value="">-- Select Topic --</option>
                                      {topics.map((topic) => (
                                          <option key={topic._id} value={topic._id}>{topic.name}</option>
                                      ))}
                                  </select>
                              </div>

                              <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Description
                                  </label>
                                  <textarea
                                      value={form.description}
                                      onChange={(e) => handleInput('description', e.target.value)}
                                      rows={4}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="Describe the test objectives and instructions..."
                                  />
                              </div>
                          </motion.div>
                      )}

                      {/* Questions Tab */}
                      {activeTab === 1 && (
                          <motion.div
                              key="questions"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-6"
                          >
                              <h2 className="text-xl font-semibold text-gray-900 mb-4">Questions Configuration</h2>

                              {['easy', 'medium', 'hard'].map((level) => (
                                  <div key={level} className="p-4 border border-gray-200 rounded-lg">
                                      <h3 className="text-lg font-medium text-gray-900 mb-4 capitalize">
                                          {level} Questions
                                      </h3>

                                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                          <div>
                                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                                  Number of Questions
                                              </label>
                                              <input
                                                  type="number"
                                                  value={form.questionCounts[level]}
                                                  onChange={(e) => handleNestedInput('questionCounts', level, Number(e.target.value))}
                                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                  placeholder="0"
                                                  min="0"
                                              />
                                          </div>

                                          <div>
                                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                                  Marks per Question
                                              </label>
                                              <input
                                                  type="number"
                                                  value={form.marks[level]}
                                                  onChange={(e) => handleNestedInput('marks', level, Number(e.target.value))}
                                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                  placeholder="1"
                                                  min="0"
                                              />
                                          </div>

                                          {form.allowNegativeMarking && (
                                              <div>
                                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                                      Negative Marks
                                                  </label>
                                                  <input
                                                      type="number"
                                                      value={form.negativeMarks[level]}
                                                      onChange={(e) => handleNestedInput('negativeMarks', level, Number(e.target.value))}
                                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                      placeholder="0"
                                                      min="0"
                                                  />
                                              </div>
                                          )}
                                      </div>
                                  </div>
                              ))}

                              {/* Summary */}
                              <div className="bg-gray-50 p-4 rounded-lg">
                                  <h3 className="text-lg font-medium text-gray-900 mb-3">Summary</h3>
                                  <div className="grid grid-cols-2 gap-4">
                                      <div className="text-center">
                                          <div className="text-2xl font-bold text-blue-600">{totalQuestions}</div>
                                          <div className="text-sm text-gray-600">Total Questions</div>
                                      </div>
                                      <div className="text-center">
                                          <div className="text-2xl font-bold text-green-600">{totalMarks}</div>
                                          <div className="text-sm text-gray-600">Total Marks</div>
                                      </div>
                                  </div>
                              </div>
                          </motion.div>
                      )}

                      {/* Settings Tab */}
                      {activeTab === 2 && (
                          <motion.div
                              key="settings"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-6"
                          >
                              <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Settings</h2>

                              <div className="space-y-4">
                                  <div className="flex items-center">
                                      <input
                                          type="checkbox"
                                          id="negativeMarking"
                                          checked={form.allowNegativeMarking}
                                          onChange={(e) => handleInput('allowNegativeMarking', e.target.checked)}
                                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                      />
                                      <label htmlFor="negativeMarking" className="ml-2 block text-sm text-gray-900">
                                          Allow Negative Marking
                                      </label>
                                  </div>

                                  <div className="text-sm text-gray-600">
                                      Enable penalty for incorrect answers to discourage guessing.
                                  </div>

                                  {form.allowNegativeMarking && (
                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                          {['easy', 'medium', 'hard'].map((level) => (
                                              <div key={level}>
                                                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                                                      {level} Negative Marks
                                                  </label>
                                                  <input
                                                      type="number"
                                                      min="0"
                                                      value={form.negativeMarks[level]}
                                                      onChange={(e) => handleNestedInput('negativeMarks', level, Number(e.target.value))}
                                                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                  />
                                              </div>
                                          ))}
                                      </div>
                                  )}
                              </div>

                              <div className="bg-blue-50 p-4 rounded-lg">
                                  <h3 className="text-lg font-medium text-blue-900 mb-3">Test Preview</h3>
                                  <div className="space-y-2 text-sm">
                                      <div><span className="font-medium">Title:</span> {form.title || 'Untitled Test'}</div>
                                      <div><span className="font-medium">Type:</span> {form.type}</div>
                                      <div><span className="font-medium">Duration:</span> {form.duration} minutes</div>
                                      <div><span className="font-medium">Questions:</span> {totalQuestions}</div>
                                      <div><span className="font-medium">Total Marks:</span> {totalMarks}</div>
                                      <div><span className="font-medium">Negative Marking:</span> {form.allowNegativeMarking ? 'Enabled' : 'Disabled'}</div>
                                  </div>
                              </div>
                          </motion.div>
                      )}
                  </AnimatePresence>
              </div>

              {/* Navigation & Submit */}
              <div className="flex justify-between items-center mt-6">
                  <button
                      onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
                      disabled={activeTab === 0}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      Previous
                  </button>

                  <div className="flex items-center gap-2">
                      {tabs.map((_, index) => (
                          <div
                              key={index}
                              className={`w-2 h-2 rounded-full ${index === activeTab ? 'bg-blue-600' : 'bg-gray-300'
                                  }`}
                          />
                      ))}
                  </div>

                  {activeTab < tabs.length - 1 ? (
                      <button
                          onClick={() => setActiveTab(Math.min(tabs.length - 1, activeTab + 1))}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      >
                          Next
                      </button>
                  ) : (
                      <button
                          onClick={handleUpdate}
                          disabled={isSubmitting || totalQuestions === 0}
                          className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                          {isSubmitting ? (
                              <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  Saving...
                              </>
                          ) : (
                              <>
                                  <CheckCircle className="w-4 h-4" />
                                  Save Test
                              </>
                          )}
                      </button>
                  )}
              </div>
          </div>
      </div>
  );
};

export default EditTestForm;