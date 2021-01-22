import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle
} from '@ionic/react';
import Reward from '../model/Reward';

interface RewardCardProps {
  reward: Reward
  onPress: any
}

const RewardCard: React.FC<RewardCardProps> = ({reward, onPress}) => {
  return (
    <IonCard key={reward.id} onClick={onPress}>
        <IonCardHeader>
            <IonCardTitle>
                {reward.name}
            </IonCardTitle>
        </IonCardHeader>
    </IonCard>
    )}

export default RewardCard;