import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonLabel
} from '@ionic/react';
import Task from '../model/Task';

interface TaskCardProps {
  task: Task
  onPress: any
}

const TaskCard: React.FC<TaskCardProps> = ({task, onPress}) => {
  return (
    <IonCard onClick={onPress}>
        <IonCardHeader>
            <IonCardTitle>
                <IonIcon icon={task.icon}></IonIcon>
                <IonLabel>{task.name}</IonLabel>
            </IonCardTitle>
        </IonCardHeader>
    </IonCard>
    )}

export default TaskCard;