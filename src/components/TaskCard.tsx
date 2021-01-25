import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle
} from '@ionic/react';
import Task from '../model/Task';

interface TaskCardProps {
  task: Task
  onPress: any
}

const TaskCard: React.FC<TaskCardProps> = ({task, onPress}) => {
  return (
    <IonCard key={task.id} onClick={onPress}>
        <IonCardHeader>
            <IonCardTitle>
                {task.name}
            </IonCardTitle>
        </IonCardHeader>
    </IonCard>
    )}

export default TaskCard;