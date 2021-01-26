import React from 'react';
import {
  IonBadge,
  IonCard,
  IonCardHeader,
  IonCardTitle
} from '@ionic/react';
import Reward from '../model/Reward';

interface RewardCardProps {
  reward: Reward
  count?: number
  onPress: any
}

const RewardCard: React.FC<RewardCardProps> = ({reward, count, onPress}) => {

  let badge
  if (count) {
    badge = <IonBadge>{count}</IonBadge>
  }

  return (
    <IonCard key={reward.id} onClick={onPress}>
        <IonCardHeader>
            <IonCardTitle>
                {reward.name}
                {badge}
            </IonCardTitle>
        </IonCardHeader>
    </IonCard>
    )}

export default RewardCard;