import PropTypes from "prop-types";
import React from "react";

import { extendFormikShape } from "app/settings/proptypes";
import FormikField from "app/base/components/FormikField";

const VMWareFormFields = ({ formikProps }) => (
  <>
    <FormikField
      label="VMware vCenter server FQDN or IP address"
      type="text"
      fieldKey="vcenter_server"
      help="VMware vCenter server FQDN or IP address which is passed to a deployed VMware ESXi host."
      formikProps={formikProps}
    />
    <FormikField
      label="VMware vCenter username"
      type="text"
      fieldKey="vcenter_username"
      help="VMware vCenter server username which is passed to a deployed VMware ESXi host."
      formikProps={formikProps}
    />
    <FormikField
      label="VMware vCenter password"
      type="text"
      fieldKey="vcenter_password"
      help="VMware vCenter server password which is passed to a deployed VMware ESXi host."
      formikProps={formikProps}
    />
    <FormikField
      label="VMware vCenter datacenter"
      type="text"
      fieldKey="vcenter_datacenter"
      help="VMware vCenter datacenter which is passed to a deployed VMware ESXi host."
      formikProps={formikProps}
    />
  </>
);

VMWareFormFields.propTypes = extendFormikShape({
  vcenter_server: PropTypes.string,
  vcenter_username: PropTypes.string,
  vcenter_password: PropTypes.string,
  vcenter_datacenter: PropTypes.string
});

export default VMWareFormFields;