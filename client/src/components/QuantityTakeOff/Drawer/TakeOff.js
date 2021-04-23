import { useState, useEffect, useContext } from 'react';
import useStyles from './styles';
import Table from './TakeOffTable';
import { QuantityContext } from '../Context';
import { Grid } from '@material-ui/core';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

const QuantityTakeOff = () => {
  const classes = useStyles();
  const [filteredValues, setFilteredValues] = useState(null);
  const [propertyList, setPropertyList] = useState(null);
  const [filterValues, setFilterValues] = useState([]);
  const { quantity } = useContext(QuantityContext);

  useEffect(() => {
    let allPropertiesTemp = [];
    if (quantity) {
      quantity.forEach((item) => {
        item.properties.forEach((singleProperty) => {
          if (allPropertiesTemp.indexOf(singleProperty.displayName) !== -1) {
            //value exists, therefore do not add
          } else {
            allPropertiesTemp.push(singleProperty.displayName);
          }
        });
      });

      setPropertyList(allPropertiesTemp);
      setFilteredValues(quantity);
    }
  }, [quantity]);

  const newFilterProperties = (allElements) => {
    const filteredElements = allElements.filter((element) => {
      let count = 0;
      return Object.values(element.properties).some((props) => {
        for (let i = 0; i < filterValues.length; i++) {
          if ([filterValues[i]].indexOf(props.displayName) > -1) {
            count++;
          }
        }
        // will fail for duplicate displayName
        return count === filterValues.length;
      });
    });

    return filteredElements;
  };

  return (
    <Grid item sm={12}>
      {propertyList ? (
        <Autocomplete
          options={propertyList}
          multiple={true}
          onChange={(event, newValue) => setFilterValues(newValue)}
          renderInput={(params) => <TextField {...params} label='Properties' variant='outlined' />}
        />
      ) : null}
      &nbsp;
      {filterValues.length > 0 ? (
        <Table data={newFilterProperties(filteredValues)} filters={filterValues} />
      ) : (
        <Table data={filteredValues} />
      )}
    </Grid>
  );
};

export default QuantityTakeOff;
