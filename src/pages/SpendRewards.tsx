import React, { useState } from 'react';
import { IonAlert, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import AchievementService from '../services/achievement-service';
import Reward from '../model/Reward';
import RewardItem from '../components/RewardItem';
import useStore from '../hooks/use-store-hook';

const SpendRewards: React.FC = () => {

  const achievementService = AchievementService()
  const [rewards, setRewards] = useState<[Reward, number][]>()
  const [showAlert, setShowAlert] = useState(false)
  const [selectedReward, setSelectedReward] = useState<Reward>()

  useStore(achievementService, () => {
        achievementService.spendableRewards()
        .then(result => {
            setRewards(result)
        },
        err => console.log(err));
    }
  )

  const spendReward = (reward: Reward) => {
    achievementService.spendReward(reward)
  }

  const rewardsList = () => {
    if (rewards?.length !== 0) {
        return rewards?.map(rewardTuple => {
          let [reward, count] = rewardTuple
          return <RewardItem key={reward.id} reward={reward} count={count} onPress={() => {
            setSelectedReward(reward)
            setShowAlert(true)
          }}></RewardItem>
        })
    } else {
      return <IonCard>
          <img src='assets/spider.jpg' />
          <IonCardHeader>
            <IonCardSubtitle>Sorry</IonCardSubtitle>
            <IonCardTitle>Nothing here</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
          It seems there are no rewards available <span role="img" aria-label="sad">😢</span><br/>
          Complete some tasks and enjoy your reward!
          </IonCardContent>
        </IonCard>
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Available Rewards</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Available Rewards</IonTitle>
          </IonToolbar>
        </IonHeader>
        {rewardsList()}
         <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          cssClass='my-custom-class'
          header={'Spend reward'}
          subHeader={selectedReward?.name}
          message={'Do you want to spend your reward? You earned it!'}
          buttons={[{
            text: "Nope",
            role: 'cancel'
          },
          {
            text: "Yes, please!",
            handler: () => {
              if (selectedReward) {
                spendReward(selectedReward)
              }
            }
          }]}
        />
         
      </IonContent>
      <a href="https://www.vecteezy.com/free-vector/spider-web">Spider Web Vectors by Vecteezy</a>
    </IonPage>
  );
};

export default SpendRewards;
