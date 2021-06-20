import React, { useEffect } from 'react';
import { map } from 'rxjs/operators';
import { useAppSelector } from '../../app/hooks';
import { asEffectReset } from '../../lib/rx';
import { getState$ } from '../../store';
import { selectDocumentTitle } from './titlesSlice';

export function DocumentTitle() {
  const [documentTitle, setDocumentTitle] = React.useState(
    useAppSelector(selectDocumentTitle)
  );
  useEffect(() =>
    asEffectReset(
      getState$()
        .pipe(map(selectDocumentTitle))
        .subscribe((title) => {
          document.title = title;
          setDocumentTitle(title);
        })
    )
  );

  return <></>;
}
