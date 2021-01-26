import React from 'react';
import {
  IonBadge,
  IonItem,
  IonLabel
} from '@ionic/react';
import Reward from '../model/Reward';

interface RewardItemProps {
  reward: Reward
  count?: number
  onPress: any
}

const RewardItem: React.FC<RewardItemProps> = ({reward, count, onPress}) => {

  let badge
  if (count) {
    badge = <IonBadge>{count}</IonBadge>
  }

  return (
    <IonItem key={reward.id} onClick={onPress}>
      <IonLabel>
        {reward.name}
      </IonLabel>
      <IonBadge>
        {badge}
      </IonBadge>
    </IonItem>
    )}

export default RewardItem;