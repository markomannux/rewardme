import React from 'react';
import {
  IonCard,
  IonIcon,
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem
} from '@ionic/react';
import Achievement from '../model/Achievement';
import './LogCard.css';

const formatDate = (date: Date) => {
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

interface LogCardProps {
  achievement: Achievement
  onPressDelete: Function
}

const LogCard: React.FC<LogCardProps> = ({achievement, onPressDelete}) => {

  let stamp
  const stampStyle = {
    transform: `rotate(${achievement.graphics?.rotate}deg)`
  }
  if (achievement.spent === 'y') {
    stamp = <img src="/assets/stamp.png" className="stamp" style={stampStyle}></img>
  }

  return (
   <IonCard>
        <IonCardHeader>
            <IonCardSubtitle>{formatDate(achievement.date)}</IonCardSubtitle>
            <IonCardTitle>
              {achievement.task.name}
            </IonCardTitle>
            <IonIcon icon={achievement.task.icon} slot="start" />
        </IonCardHeader>
        <IonButton fill="outline" slot="end">Delete</IonButton>
      <IonCardContent>Your reward: {achievement.reward.name}</IonCardContent>
      <IonItem lines="none">
        <IonButton fill="outline" color="danger" slot="start" onClick={() => onPressDelete()}>Delete</IonButton>
      </IonItem>
      {stamp}
    </IonCard>
  );
};

export default LogCard;