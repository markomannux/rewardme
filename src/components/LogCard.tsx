import React from 'react';
import {
  IonCard,
  IonIcon,
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle
} from '@ionic/react';
import Achievement from '../model/Achievement';

const LogCard: React.FC<Achievement> = ({date, task, reward}) => {
  return (
   <IonCard>
        <IonCardHeader>
            <IonCardSubtitle>{date}</IonCardSubtitle>
            <IonCardTitle>
              {task.name}
            </IonCardTitle>
            <IonIcon icon={task.icon} slot="start" />
        </IonCardHeader>
        <IonButton fill="outline" slot="end">Delete</IonButton>
      <IonCardContent>Your reward: {reward.name}</IonCardContent>
    </IonCard>
  );
};

export default LogCard;