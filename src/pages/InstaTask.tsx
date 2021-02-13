import React, { useState } from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonPage, IonItem, IonTitle, IonToolbar, IonCardSubtitle, IonCardContent, IonLabel, IonInput, IonToast, IonList, IonListHeader, IonModal, IonButtons, IonButton } from '@ionic/react';
import AchievementService from '../services/achievement-service';
import { RouteComponentProps, useHistory } from 'react-router';
import Reward from '../model/Reward';
import RewardService from '../services/reward-service';
import { add } from 'ionicons/icons';
import Task from '../model/Task';
import useStore from '../hooks/use-store-hook';
import RewardItem from '../components/RewardItem';
import RewardForm from '../components/RewardForm';

interface CompleteTaskProps extends RouteComponentProps<{
  id: string
}> {}

const InstaTask: React.FC<CompleteTaskProps> = ({match}) => {

  const achievementService = AchievementService()
  const rewardService = RewardService()
  const history = useHistory();
  const [rewards, setRewards] = useState<Reward[]>()
  const [taskName, setTaskName] = useState<string|null|undefined>()
  const [showValidationToast, setShowValidationToast] = useState<boolean>(false)
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false)
  const [showModal, setShowModal] = useState(false);

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

  const clearModal = () => {
    setShowModal(false)
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
          <img src='assets/lightning_bolt.jpg' alt="" />
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
          <IonItem>
            or&nbsp;<a href="" onClick={(event) => {
              event.preventDefault()
              setShowModal(true)
            }}>add a new one</a>
          </IonItem>
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
         <IonModal isOpen={showModal} cssClass='my-custom-class'>
          <IonHeader>
            <IonToolbar color="success">
              <IonTitle>Add a new reward</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => {
                    clearModal()
                  }
                }>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <RewardForm
            onSave={() => {
              clearModal() 
            }}
            onDelete={() => {
              clearModal() 
            }
            }></RewardForm>
        </IonModal>
      </IonContent>
      <a href="https://www.vecteezy.com/free-vector/thunderbolt">Thunderbolt Vectors by Vecteezy</a>
    </IonPage>
  );
};

export default InstaTask;
