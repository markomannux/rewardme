import React, { useState } from 'react';
import { IonAlert, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonPage, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import AchievementService from '../services/achievement-service';
import Reward from '../model/Reward';
import RewardItem from '../components/RewardItem';
import useStore from '../hooks/use-store-hook';
import Achievement from '../model/Achievement';
import useUndoAction from '../hooks/undo-action-hook';

const SpendRewards: React.FC = () => {

  const achievementService = AchievementService()
  const [rewards, setRewards] = useState<[Reward, number][]>()
  const [showAlert, setShowAlert] = useState(false)
  const [selectedReward, setSelectedReward] = useState<Reward>()
  const [spentAchievement, setSpentAchievement] = useState<Achievement>()

  const [shown, show, hide, undo] = useUndoAction(spentAchievement, (achievement: Achievement) => {
    if (achievement) {
      achievementService.unspendReward(achievement)
    }
  })

  useStore(achievementService, () => {
        achievementService.spendableRewards()
        .then(result => {
            setRewards(result)
        },
        err => console.log(err));
    }
  )

  const spendReward = async (reward: Reward) => {
    const spentAchievement = await achievementService.spendReward(reward)
    if (spentAchievement) {
      setSpentAchievement(spentAchievement)
      show()
    }
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
        <IonToolbar color="success">
          <IonTitle>Gained Rewards</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar color="success">
            <IonTitle size="large">Gained Rewards</IonTitle>
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
      <IonToast
        isOpen={shown}
        onDidDismiss={() => hide()}
        message="Reward spent"
        position="top"
        duration={4000}
        buttons={[
          {
            side: 'end',
            text: 'Undo',
            role: 'cancel',
            handler: () => {
              undo()
            }
          }
        ]}
      />
      <a href="https://www.vecteezy.com/free-vector/spider-web">Spider Web Vectors by Vecteezy</a>
    </IonPage>
  );
};

export default SpendRewards;
