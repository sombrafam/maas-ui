import { Col, Spinner, Row } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

import { config as configActions } from "app/settings/actions";
import configSelectors from "app/store/config/selectors";
import { useWindowTitle } from "app/base/hooks";
import ThirdPartyDriversForm from "../ThirdPartyDriversForm";

const ThirdPartyDrivers = () => {
  const loaded = useSelector(configSelectors.loaded);
  const loading = useSelector(configSelectors.loading);
  const dispatch = useDispatch();

  useWindowTitle("Ubuntu");

  useEffect(() => {
    if (!loaded) {
      dispatch(configActions.fetch());
    }
  }, [dispatch, loaded]);

  return (
    <Row>
      <Col size={6}>
        {loading && <Spinner text="Loading..." />}
        {loaded && <ThirdPartyDriversForm />}
      </Col>
    </Row>
  );
};

export default ThirdPartyDrivers;
