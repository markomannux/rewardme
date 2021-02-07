import React from 'react';
import {
  IonIcon,
  IonItem,
  IonLabel
} from '@ionic/react';
import Task from '../model/Task';

interface TaskItemProps {
  task: Task
  onPress: any
}

const TaskItem: React.FC<TaskItemProps> = ({task, onPress}) => {

  return (
    <IonItem key={task.id} onClick={onPress}>
      <IonIcon icon={task.icon} slot="start" />
      <IonLabel>
        {task.name}
      </IonLabel>
    </IonItem>
    )}

export default TaskItem;