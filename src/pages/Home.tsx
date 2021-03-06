import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonItem, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonButton, IonIcon, IonLabel, IonAlert, IonInfiniteScroll, IonInfiniteScrollContent, IonList, IonToast } from '@ionic/react';
import LogCard from '../components/LogCard'
import './Home.css';
import Achievement from '../model/Achievement';
import TaskListItem from '../components/TaskListItem';
import AchievementService from '../services/achievement-service';
import TaskService from '../services/task-service'
import Task from '../model/Task';
import { flash } from 'ionicons/icons'
import useStore from '../hooks/use-store-hook';
import useInfiniteScroll from '../hooks/infinite-scroll';
import useUndoAction from '../hooks/undo-action-hook'


const Home: React.FC = () => {

  const achievementService = AchievementService()
  const taskService = TaskService()
  const emptyAchievements: Achievement[] = []
  const emptyTasks: Task[] = []
  const [tasks, setTasks] = useState(emptyTasks)
  const [achievements, setAchievements] = useState(emptyAchievements);
  const [achievementToDelete, setAchievementToDelete] = useState<Achievement>();
  const [showAlert, setShowAlert] = useState(false)

  const [disableInfiniteScroll, getAchievements] = useInfiniteScroll(async () => {
    let cursor = await achievementService.openCursor('dateIndex', null, 'prev')
    return cursor
  },
  async (fetched: Achievement[]) => {
      setAchievements([...achievements, ...fetched])
  }) 
  
  const [shown, show, hide, setUndoItem, undo] = useUndoAction((achievement: Achievement) => {
    if (achievement) {
      achievementService.unspendReward(achievement)
    }
  })

  const getTasks = async () => {
    taskService.list()
    .then(result => {
      setTasks(result)
    },
    err => console.log(err))
  }

  useStore(achievementService, getAchievements)
  useStore(taskService, getTasks)

  async function searchNext($event: CustomEvent<void>) {
    await getAchievements();
    ($event.target as HTMLIonInfiniteScrollElement).complete();
  }

  let taskList
  if (tasks.length > 0) {
    taskList = (<IonList>
          {tasks.map(task => <TaskListItem key={task.id} {...task}/>)}
        </IonList>)
  } else {
    taskList = <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>Hey!</IonCardSubtitle>
            <IonCardTitle>No tasks!</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            It seems you didn't set up any task. Let's find something to do!
          </IonCardContent>
          <IonCardContent>
            <IonButton expand="block" routerLink="/settings/tasks">Set up tasks</IonButton>
          </IonCardContent>
      </IonCard>
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="success">
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      <IonHeader collapse="condense">
          <IonToolbar color="success">
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonItem>
          <h2>Recurring tasks</h2>
        </IonItem>
        {taskList} 

        <section className="rewardme-cta">
          <IonLabel>
            Did something epic and unique?<br/>
            Add it here!
          </IonLabel>
          <IonButton expand="block" routerLink="/home/instatask" color="success">
            <IonIcon slot="start" icon={flash} />
            Instatask
          </IonButton>
        </section>

        <IonItem>
          <h2>Log</h2>
        </IonItem>

        {achievements.map(achievement =>
        <LogCard
            key={achievement.id}
            achievement={achievement}
            onPressDelete={() => {
              setAchievementToDelete(achievement)
              setShowAlert(true)
            }}
            onPressSpend={async () => {
              const spentAchievement = await achievementService.spendReward(achievement.reward)
              if (spentAchievement) {
                setUndoItem(spentAchievement)
                show()
              }
            }}
        ></LogCard>)}

        <IonInfiniteScroll threshold="100px"
        disabled={disableInfiniteScroll}
        onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
          <IonInfiniteScrollContent
            loadingText="Loading more stuff you should be proud of" 
          >

          </IonInfiniteScrollContent>
        </IonInfiniteScroll>
        <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        cssClass='my-custom-class'
        header={'Delete Achievement'}
        message={'Do you really want to delete this achievement?'}
        buttons={[{
          text: "Nope",
          role: 'cancel'
        },
        {
          text: "Yes, please!",
          handler: () => {
            if (achievementToDelete) {
              achievementService.delete(achievementToDelete)
              setAchievementToDelete(undefined)
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
    </IonPage>
  );
};

export default Home;
