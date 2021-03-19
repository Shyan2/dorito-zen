import { useState, useMemo, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Grow, Grid } from '@material-ui/core';

import { QuantityContext, UrnContext } from '../Context';

import FileTree from './FileTree';
import Viewer from '../Viewer/Viewer';
import QuantityTakeOff from '../QuantityTakeOff/QuantityTakeOff';

const Models = () => {
  const [urn, setUrn] = useState(null);
  const [quantity, setQuantity] = useState(null);

  const urnValue = useMemo(() => ({ urn, setUrn }), [urn, setUrn]);
  const quantityValue = useMemo(() => ({ quantity, setQuantity }), [
    quantity,
    setQuantity,
  ]);

  const tableRef = useRef();
  const scrollToTable = () => {
    tableRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  useEffect(() => {
    scrollToTable();
  }, [quantity]);

  const token = useSelector((state) => state?.forge?.forgeToken);

  return (
    <UrnContext.Provider value={urnValue}>
      <Grow in>
        <Grid container spacing={3}>
          <Grid item sm={12} lg={3}>
            <FileTree />
          </Grid>
          <QuantityContext.Provider value={quantityValue}>
            <Grid item sm={12} lg={9}>
              <Viewer />
            </Grid>
            <Grid item lg={12} sm={12} ref={tableRef}>
              {quantity ? <QuantityTakeOff /> : null}
            </Grid>
          </QuantityContext.Provider>
        </Grid>
      </Grow>
    </UrnContext.Provider>
  );
};

export default Models;
