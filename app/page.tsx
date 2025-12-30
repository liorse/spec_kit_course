'use client';

// Main DoIt goal tracking page
import { useState } from 'react';
import { useGoals } from './hooks/useGoals';
import { GoalColumn } from './components/GoalColumn';
import { GoalCard } from './components/GoalCard';
import { EmptyState } from './components/EmptyState';
import { AddGoalButton } from './components/AddGoalButton';
import { AddGoalModal } from './components/AddGoalModal';

export default function Home() {
  const { activeGoals, completedGoals, addGoal, completeGoal, uncompleteGoal, deleteGoal, reorderGoals } = useGoals();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddGoal = (title: string, endDate: string) => {
    addGoal(title, endDate);
  };

  const handleReorderActive = (oldIndex: number, newIndex: number) => {
    if (activeGoals[oldIndex]) {
      reorderGoals(activeGoals[oldIndex].id, oldIndex, newIndex, 'active');
    }
  };

  const handleReorderCompleted = (oldIndex: number, newIndex: number) => {
    if (completedGoals[oldIndex]) {
      reorderGoals(completedGoals[oldIndex].id, oldIndex, newIndex, 'completed');
    }
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">DoIt</h1>
          <p className="text-muted-foreground mt-2">Track your goals and deadlines</p>
        </header>

        {/* Two-column layout: Active Goals | Completed Goals */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Active Goals Column */}
          <GoalColumn 
            title="Active Goals"
            status="active"
            onReorder={handleReorderActive}
          >
            {activeGoals.length === 0 ? (
              <EmptyState message="No active goals yet. Click the + button to add your first goal!" />
            ) : (
              activeGoals.map(goal => (
                <GoalCard 
                  key={goal.id} 
                  goal={goal}
                  onComplete={completeGoal}
                  onDelete={deleteGoal}
                />
              ))
            )}
          </GoalColumn>

          {/* Completed Goals Column */}
          <GoalColumn 
            title="Completed Goals"
            status="completed"
            onReorder={handleReorderCompleted}
          >
            {completedGoals.length === 0 ? (
              <EmptyState message="No completed goals yet." />
            ) : (
              completedGoals.map(goal => (
                <GoalCard 
                  key={goal.id} 
                  goal={goal}
                  onUncomplete={uncompleteGoal}
                  onDelete={deleteGoal}
                />
              ))
            )}
          </GoalColumn>
        </div>
      </div>

      {/* Add Goal Button */}
      <AddGoalButton onClick={() => setIsModalOpen(true)} />

      {/* Add Goal Modal */}
      <AddGoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddGoal}
      />
    </main>
  );
}

