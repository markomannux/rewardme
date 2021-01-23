import React from 'react';
import { IonLabel, IonItem, IonIcon } from '@ionic/react';

interface TaskListItemProps {
    id?: string
    name: string
    icon: string
}

const TaskListItem: React.FC<TaskListItemProps> = ({id, name, icon}) => {

  return (
    <IonItem routerLink={"/home/complete/" + id}>
        <IonIcon icon={icon} slot="start" />
        <IonLabel>{name}</IonLabel>
    </IonItem>
  )}

export default TaskListItem