import React from 'react';
import {
  IonCard,
  IonIcon,
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonLabel
} from '@ionic/react';
import Achievement from '../model/Achievement';
import './LogCard.css';

const formatDate = (date: Date) => {
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

interface LogCardProps {
  achievement: Achievement
  onPressDelete: Function,
  onPressSpend: Function
}

const LogCard: React.FC<LogCardProps> = ({achievement, onPressDelete, onPressSpend}) => {

  let stamp
  const stampStyle = {
    transform: `rotate(${achievement.graphics?.rotate}deg)`
  }
  if (achievement.spent === 'y') {
    stamp = <img src="/assets/stamp.png" className="stamp" style={stampStyle}></img>
  }

  const buttons = <IonItem lines='none'>
        <IonButton fill="outline" color="success" slot="start" onClick={() => onPressSpend()}>Spend</IonButton>
        <IonButton fill="outline" color="medium" slot="start" onClick={() => onPressDelete()}>Delete</IonButton>
  </IonItem>

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
      <IonCardContent>
        <div className="small ion-color-medium">
          Your reward: 
        </div>
        <div>
          {achievement.reward.name}
        </div>
      </IonCardContent>
      {achievement.spent !== 'y'? buttons : ''}
      {stamp}
    </IonCard>
  );
};

export default LogCard;