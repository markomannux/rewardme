import React, { useState } from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonPage, IonItem, IonTitle, IonToolbar, IonCardSubtitle, IonCardContent, IonLabel, IonInput, IonToast, IonList, IonListHeader } from '@ionic/react';
import AchievementService from '../services/achievement-service';
import { RouteComponentProps, useHistory } from 'react-router';
import Reward from '../model/Reward';
import RewardCard from '../components/RewardCard';
import RewardService from '../services/reward-service';
import { add } from 'ionicons/icons';
import Task from '../model/Task';
import useStore from '../hooks/use-store-hook';
import RewardItem from '../components/RewardItem';

interface CompleteTaskProps extends RouteComponentProps<{
  id: string
}> {}

const InstaTask: React.FC<CompleteTaskProps> = ({match}) => {

  const history = useHistory();
  const [rewards, setRewards] = useState<Reward[]>()
  const [showValidationToast, setShowValidationToast] = useState<boolean>(false)
  const achievementService = AchievementService()
  const rewardService = RewardService()
  let [taskName, setTaskName] = useState<string|null|undefined>()
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  useStore(rewardService, () => {
        rewardService.list()
        .then(result => {
            setRewards(result)
        },
        err => console.log(err));
    }
  )

  const handleRewardTap = (reward: Reward) => {
    if (!taskName) return
    const now = new Date()
    const task: Task = {
      name: taskName,
      icon: add
    }
    const achievement = {
      task,
      reward,
      spent: 'n',
      date: now
    }
    achievementService.add(achievement)
    .then(() => {
      setTaskName(undefined)
      setShowSuccessToast(true)
      history.push('/')
    })
    .catch(

    )
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="success">
          <IonTitle>Choose a reward</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar color="success">
            <IonTitle size="large">Instatask</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonCard>
          <img src='assets/lightning_bolt.jpg' />
          <IonCardHeader>
            <IonCardSubtitle>You did it!</IonCardSubtitle>
            <IonCardTitle>Instatask!</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>Name your achievement and choose a reward! You earned it!</IonCardContent>
        </IonCard>
        <IonItem>
          <IonLabel position="stacked" color={taskName?"primary":"danger"}>Name</IonLabel>
          <IonInput value={taskName} required={true} onIonChange={e => {
            setTaskName(e.detail.value)
          }
          }> </IonInput>
        </IonItem>
        <IonList>
          <IonListHeader>
            Choose a suitable reward
          </IonListHeader>
          {rewards?.map((reward) => {
            return <RewardItem key={reward.id} reward={reward} onPress={() => {
                if (!taskName) {
                  setShowValidationToast(true)
                } else {
                  handleRewardTap(reward)
                }
            }}></RewardItem>
          })}
        </IonList>
        <IonItem>
          <a href="https://www.vecteezy.com/free-vector/1">1 Vectors by Vecteezy</a>
        </IonItem>
         <IonToast
          isOpen={showValidationToast}
          onDidDismiss={() => setShowValidationToast(false)}
          message="Provide a name for the task!"
          duration={600}
        />
        <IonToast
          isOpen={showSuccessToast}
          onDidDismiss={() => setShowSuccessToast(false)}
          message="Instatask achieved!"
          duration={600}
        />
      </IonContent>
      <a href="https://www.vecteezy.com/free-vector/thunderbolt">Thunderbolt Vectors by Vecteezy</a>
    </IonPage>
  );
};

export default InstaTask;
