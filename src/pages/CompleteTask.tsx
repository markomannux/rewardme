import React, { useEffect, useState } from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonPage, IonItem, IonTitle, IonToolbar, IonCardSubtitle, IonCardContent, IonList, IonListHeader, IonToast } from '@ionic/react';
import TaskService from '../services/task-service';
import AchievementService from '../services/achievement-service';
import { RouteComponentProps, useHistory } from 'react-router';
import Task from '../model/Task';
import Reward from '../model/Reward';
import RewardService from '../services/reward-service';
import useStore from '../hooks/use-store-hook';
import RewardItem from '../components/RewardItem';

interface CompleteTaskProps extends RouteComponentProps<{
  id: string
}> {}

const CompleteTask: React.FC<CompleteTaskProps> = ({match}) => {

  const taskService = TaskService()
  const history = useHistory();
  const [rewards, setRewards] = useState<Reward[]>()
  const achievementService = AchievementService()
  const rewardService = RewardService()
  let [task, setTask] = useState<Task>()
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  useEffect(() => {
    const getTask = () => {
        taskService.get(match.params.id)
        .then(result => {
            setTask(result)
        },
        err => console.log(err));
    }
    
    getTask()
  }, [match.params.id])

  useStore(rewardService, () => {
        rewardService.list()
        .then(result => {
            setRewards(result)
        },
        err => console.log(err));
    }
  )

  const handleRewardTap = (task: Task, reward: Reward) => {
    const now = new Date()
    const achievement = {
      task,
      reward,
      spent: 'n',
      date: now
    }
    achievementService.add(achievement)
    .then(() => {
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
            <IonTitle size="large">Congratulations!</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonCard>
          <img src='assets/trophy.jpg' />
          <IonCardHeader>
            <IonCardSubtitle>You completed</IonCardSubtitle>
            <IonCardTitle>{task?.name}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Keep up with the good job and enjoy your reward!
          </IonCardContent>
        </IonCard>
        <IonList>
          <IonListHeader>
            Choose one suitable reward
          </IonListHeader>
          {rewards?.map((reward) => {
            return <RewardItem key={reward.id} reward={reward} onPress={() => {
                if (task) {
                  handleRewardTap(task, reward)
                }
            }}></RewardItem>
          })}
        </IonList>
        <IonItem>
          <a href="https://www.vecteezy.com/free-vector/1">1 Vectors by Vecteezy</a>
        </IonItem>
        <IonToast
          isOpen={showSuccessToast}
          onDidDismiss={() => setShowSuccessToast(false)}
          message="Reward has been achieved!"
          duration={600}
        />
      </IonContent>
    </IonPage>
  );
};

export default CompleteTask;
