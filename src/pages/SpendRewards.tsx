import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import RewardCard from '../components/RewardCard';
import AchievementService from '../services/achievement-service';
import RewardService from '../services/reward-service';
import Achievement from '../model/Achievement';

const SpendRewards: React.FC = () => {

  const rewardService = RewardService()
  const achievementService = AchievementService()
  const [rewards, setRewards] = useState<Achievement[]>()


  useEffect(() => {
    const getSpendableRewards = () => {
        achievementService.spendableRewards()
        .then(result => {
            setRewards(result)
        },
        err => console.log(err));
    }
    const handler = () => getSpendableRewards()
    achievementService.on('item:added', handler)
    
    getSpendableRewards()

    return () => {
      rewardService.off('item:added', handler)
    }
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Rewards</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Rewards</IonTitle>
          </IonToolbar>
        </IonHeader>
        {rewards?.map((reward) => {
          return <RewardCard key={reward.id} reward={reward.reward} onPress={() => {
          }}></RewardCard>
        })}
         
      </IonContent>
    </IonPage>
  );
};

export default SpendRewards;
