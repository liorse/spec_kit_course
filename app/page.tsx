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
    <main className="min-h-screen bg-background p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">DoIt</h1>
            <p className="text-muted-foreground mt-2 text-lg">Focus on what matters.</p>
          </div>
          <div className="text-sm text-muted-foreground font-medium bg-muted/50 px-3 py-1 rounded-full">
            {activeGoals.length} active • {completedGoals.length} completed
          </div>
        </header>

        {/* Two-column layout: Active Goals | Completed Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
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

