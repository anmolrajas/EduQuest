import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MenuBook,
  Layers,
  HelpOutline,
  Quiz,
} from '@mui/icons-material';

const Content = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Subjects',
      description: 'Manage academic subjects easily.',
      icon: <MenuBook fontSize="large" />,
      color: 'bg-blue-600',
      route: '/admin/content/subjects',
    },
    {
      title: 'Topics',
      description: 'Organize your topics under subjects.',
      icon: <Layers fontSize="large" />,
      color: 'bg-green-600',
      route: '/admin/content/topics',
    },
    {
      title: 'Questions',
      description: 'Maintain and curate questions efficiently.',
      icon: <HelpOutline fontSize="large" />,
      color: 'bg-purple-600',
      route: '/admin/content/questions',
    },
    {
      title: 'Quiz Management',
      description: 'Create and schedule quizzes smoothly.',
      icon: <Quiz fontSize="large" />,
      color: 'bg-rose-600',
      route: '/admin/content/quizzes',
    },
  ];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-10 text-gray-800">
        Content Management
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.route)}
            className={`relative text-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300 cursor-pointer ${card.color}`}
          >
            <div className="mb-4">
              <div className="bg-white/20 p-4 inline-flex items-center justify-center rounded-xl">
                {card.icon}
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
            <p className="text-sm text-white/90">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Content;
