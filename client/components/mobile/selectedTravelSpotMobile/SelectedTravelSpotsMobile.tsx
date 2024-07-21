import type { DragEndEvent } from '@dnd-kit/core';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TravelSpot } from 'common/types/travelSpots';
import { Loading } from 'components/loading/Loading';
import { useRouter } from 'next/router';
import type React from 'react';
import { useState } from 'react';
import { pagesPath } from 'utils/$path';
import styles from './SelectedTravelSpotsMobile.module.css';

type SelectedTravelSpotsProps = {
  selectedSpots: TravelSpot[];
  setTravelSpots: React.Dispatch<React.SetStateAction<TravelSpot[]>>;
  onBackPage?: () => void;
  buttonType?: 'travelSpotList' | 'sightseeingMap';
};

const SelectedTravelSpotsMobile: React.FC<SelectedTravelSpotsProps> = ({
  selectedSpots,
  setTravelSpots,
  onBackPage,
  buttonType = 'travelSpotList',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = selectedSpots.findIndex((spot) => spot.name === active.id);
      const newIndex = selectedSpots.findIndex((spot) => spot.name === over?.id);

      const newSelectedSpots = arrayMove(selectedSpots, oldIndex, newIndex);

      // インデックスを更新
      const updatedSelectedSpots = newSelectedSpots.map((item: TravelSpot, index: number) => ({
        ...item,
        index,
      }));

      setIsLoading(true);

      // 全体のスポットリストを更新
      setTravelSpots((prevTravelSpots) =>
        prevTravelSpots.map(
          (spot) => updatedSelectedSpots.find((s: TravelSpot) => s.name === spot.name) || spot,
        ),
      );

      setIsLoading(false);
    }
  };

  const SortableItem: React.FC<{ spot: TravelSpot }> = ({ spot }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
      id: spot.name,
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <li ref={setNodeRef} style={style} {...attributes} {...listeners} className={styles.listItem}>
        <h3 className={styles.listTitle}>
          {spot.index !== null ? `${spot.index + 1}. ` : ''}
          {spot.name}
        </h3>
      </li>
    );
  };

  const handleDecide = () => {
    if (selectedSpots.some((spot) => spot.isSelected)) {
      setIsLoading(true);
      router.push(pagesPath.sightseeingMap.$url());
      setIsLoading(false);
    } else {
      alert('行き先を選択してください');
    }
  };

  return (
    <div className={styles.main}>
      <Loading visible={isLoading} />
      <div className={styles.buttonGroup}>
        {buttonType === 'sightseeingMap' ? (
          <button onClick={onBackPage} className={`${styles.commonButton} ${styles.backButton}`}>
            行き先選択に戻る
          </button>
        ) : (
          <button
            onClick={handleDecide}
            className={`${styles.commonButton} ${styles.decideButton}`}
          >
            行き先決定
          </button>
        )}

        <details onClick={() => setIsMenuOpen(!isMenuOpen)} className={styles.summaryButton}>
          <summary className={styles.summaryBtn} />
        </details>
      </div>

      {isMenuOpen && (
        <>
          {buttonType !== 'sightseeingMap' && (
            <div className={styles.resetButtonContainer}>
              <button
                onClick={() => setTravelSpots([])}
                className={`${styles.commonButton} ${styles.resetButton}`}
              >
                リセット
              </button>
            </div>
          )}
          <div className={styles.listContainer}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={selectedSpots.map((spot) => spot.name)}>
                <ul>
                  {selectedSpots
                    .sort((a, b) => (a.index !== null && b.index !== null ? a.index - b.index : 0))
                    .map((spot) => (
                      <SortableItem key={spot.name} spot={spot} />
                    ))}
                </ul>
              </SortableContext>
            </DndContext>
          </div>
        </>
      )}
    </div>
  );
};

export default SelectedTravelSpotsMobile;
