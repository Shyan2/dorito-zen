import { useState, useMemo, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Container, Grow, Grid } from '@material-ui/core';

import { QuantityContext, UrnContext } from '../Context';

import FileTree from './FileTree';
import Viewer from '../Viewer/Viewer';
import QuantityTakeOff from '../QuantityTakeOff/QuantityTakeOff';
import usestyles from './styles';

const Models = () => {
  const classes = usestyles();
  const [urn, setUrn] = useState(null);
  const [quantity, setQuantity] = useState(null);

  const urnValue = useMemo(() => ({ urn, setUrn }), [urn, setUrn]);
  const quantityValue = useMemo(() => ({ quantity, setQuantity }), [quantity, setQuantity]);

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
      <QuantityContext.Provider value={quantityValue}>
        <Grow in>
          <Container maxWidth={false} className={classes.modelContainer}>
            <Grid container className={classes.gridContainer} spacing={3}>
              <Grid item xs={12} sm={12} md={4} lg={3}>
                <FileTree />
              </Grid>
              <Grid item xs={12} sm={12} md={8} lg={9}>
                <Viewer />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item lg={12} sm={12} ref={tableRef}>
                {quantity ? <QuantityTakeOff /> : null}
              </Grid>
            </Grid>
          </Container>
        </Grow>
      </QuantityContext.Provider>
    </UrnContext.Provider>
  );
};

export default Models;
