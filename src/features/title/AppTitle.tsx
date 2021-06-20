import React, { useEffect } from 'react';
import { map } from 'rxjs/operators';
import { useAppSelector } from '../../app/hooks';
import { asEffectReset } from '../../lib/rx';
import { getState$ } from '../../store';
import { selectAppTitle } from './titlesSlice';

export function AppTitle() {
  const [appBarTitle, setAppBarTitle] = React.useState(
    useAppSelector(selectAppTitle)
  );
  useEffect(
    () =>
      asEffectReset(
        getState$().pipe(map(selectAppTitle)).subscribe(setAppBarTitle)
      ),
    []
  );

  return <>{appBarTitle}</>;
}
