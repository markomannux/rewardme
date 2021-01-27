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
import './LogCard.css';

const formatDate = (date: Date) => {
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const LogCard: React.FC<Achievement> = ({date, task, reward, spent}) => {

  let stamp
  if (spent === 'y') {
    stamp = <div className="stamp">spent</div>
  }

  return (
   <IonCard>
        <IonCardHeader>
            <IonCardSubtitle>{formatDate(date)}</IonCardSubtitle>
            <IonCardTitle>
              {task.name}
            </IonCardTitle>
            <IonIcon icon={task.icon} slot="start" />
        </IonCardHeader>
        <IonButton fill="outline" slot="end">Delete</IonButton>
      <IonCardContent>Your reward: {reward.name}</IonCardContent>
      {stamp}
    </IonCard>
  );
};

export default LogCard;