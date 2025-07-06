import React, { useEffect, useState } from 'react';
import { Button, Input, Select, MenuItem, IconButton, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Undo2, Plus } from 'lucide-react';
import testService from '../../../../../service/testService';
import { RotateCcw, Search  } from 'lucide-react';
import { toast } from 'react-toastify';

const TestDashboard = () => {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, []);


  const fetchTests = async (filters = {}) => {
      try {
        const sampleData = await testService.getTests(filters);
        if (sampleData?.success) {
          setTests(sampleData.data);
          setFilteredTests(sampleData.data);
        }
      } catch (error) {
        toast.error('Error fetching tests');
      } finally {
        setLoading(false);
      }
    };

  const handleDelete = async (id) => {
    try {
      const res = await testService.deleteTest(id);
      console.log("Delete response:", res);
      if (res.success) {
        toast.success('Test deleted successfully.');
        setTimeout(() => fetchTests(), 1000); // 1 second delay
      } else {
        toast.error(res.message || 'Failed to delete test.');
      }
    } catch (error) {
      toast.error('Error deleting test.');
    }
  };

  const handleRestore = async (id) => {
    try {
      const res = await testService.restoreTest(id);
      console.log("Restore response:", res);
      if (res.success) {
        toast.success('Test restored successfully.');
        setTimeout(() => fetchTests(), 1000); // 1 second delay
      } else {
        toast.error(res.message || 'Failed to restore test.');
      }
    } catch (error) {
      toast.error('Error restoring test.');
    }
  };


  const handleSearch = () => {
    const filters = {};
    if (search.trim()) filters.search = search.trim();
    if (typeFilter !== 'all') filters.type = typeFilter;
    fetchTests(filters);
  };

  const handleReset = () => {
    setSearch('');
    setTypeFilter('all');
    fetchTests();
  };

  const handleCreate = () => navigate('/admin/content/tests/create');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tests</h1>
        <Button variant="contained" onClick={() => {handleCreate()}} startIcon={<Plus className="h-4 w-4" />}>
          Create Test
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input
          placeholder="Search tests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/3"
        />
        <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <MenuItem value="all">All Types</MenuItem>
          <MenuItem value="practice">Practice</MenuItem>
          <MenuItem value="mock">Mock</MenuItem>
          <MenuItem value="assignment">Assignment</MenuItem>
          <MenuItem value="quiz">quiz</MenuItem>
          <MenuItem value="exam">Exam</MenuItem>
        </Select>
        <Button variant="contained" onClick={handleSearch} startIcon={<Search size={16} />}>
          Search
        </Button>
        <Button variant="outlined" onClick={handleReset} startIcon={<RotateCcw size={16} />}>
          Reset
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={60} className="rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">#</th>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Title</th>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Description</th>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Type</th>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Duration</th>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Marks</th>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Status</th>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-gray-500 text-lg">
                    No Tests Found
                  </td>
                </tr>
              ) : (
                filteredTests.map((test, index) => (
                  <tr key={test._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-center">{index + 1}</td>
                    <td className="py-3 px-4 text-center">{test.title}</td>
                    <td className="py-3 px-4 text-center">{test.description}</td>
                    <td className="py-3 px-4 text-center capitalize">{test.type}</td>
                    <td className="py-3 px-4 text-center">{test.duration} min</td>
                    <td className="py-3 px-4 text-center">{test.totalQuestions} Qs / {test.totalMarks} Marks</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-xs px-2 py-1 rounded-full ${test.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {test.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <IconButton color="primary" onClick={() => navigate(`/admin/content/tests/edit-test/${test._id}`)}>
                        <Pencil className="h-4 w-4" />
                      </IconButton>
                      {!test.isDeleted ? (
                        <IconButton color="error" title='Delete' onClick={() => handleDelete(test._id)}>
                          <Trash2 className="h-4 w-4" />
                        </IconButton>
                      ) : (
                        <IconButton color="success" title='Restore' onClick={() => handleRestore(test._id)}>
                          <Undo2 className="h-4 w-4" />
                        </IconButton>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TestDashboard;