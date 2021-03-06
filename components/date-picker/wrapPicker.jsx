import React, { PropTypes } from 'react';
import TimePicker from 'rc-time-picker';
import DateTimeFormat from 'gregorian-calendar-format';
import GregorianCalendar from 'gregorian-calendar';
import classNames from 'classnames';
import defaultLocale from './locale/zh_CN';

export default function wrapPicker(Picker, defaultFormat) {
  return class PickerWrapper extends React.Component {
    static defaultProps = {
      format: defaultFormat || 'yyyy-MM-dd',
      transitionName: 'slide-up',
      popupStyle: {},
      onChange() {},
      onOk() {},
      locale: {},
      align: {
        offset: [0, -9],
      },
      open: false
    }

    static contextTypes = {
      antLocale: PropTypes.object,
    }

    constructor(props) {
      super(props);

      this.state = {};
    }

    // remove input readonly warning
    handleInputChange() {}

    getLocale() {
      const props = this.props;
      let locale = defaultLocale;
      const context = this.context;
      if (context.antLocale && context.antLocale.DatePicker) {
        locale = context.antLocale.DatePicker;
      }
      // 统一合并为完整的 Locale
      const result = { ...locale, ...props.locale };
      result.lang = { ...locale.lang, ...props.locale.lang };
      return result;
    }

    getFormatter = () => {
      if (!this.formats) {
        this.formats = {};
      }

      const formats = this.formats;
      const format = this.props.format;
      if (formats[format]) {
        return formats[format];
      }
      formats[format] = new DateTimeFormat(format, this.getLocale().lang.format);
      return formats[format];
    }

    parseDateFromValue = (value) => {
      if (value) {
        if (typeof value === 'string') {
          return this.getFormatter().parse(value, { locale: this.getLocale() });
        } else if (value instanceof Date) {
          let date = new GregorianCalendar(this.getLocale());
          date.setTime(+value);
          return date;
        }
      }
      return value;
    }

    toggleOpen = (e) => {
      this.setState({
        open: e.open
      });
    }

    render() {
      const props = this.props;
      const state = this.state;
      const pickerClass = classNames({
        'ant-calendar-picker': true,
        'ant-calendar-picker-open': state.open
      });
      const pickerInputClass = classNames({
        'ant-calendar-range-picker': true,
        'ant-input': true,
        'ant-input-lg': props.size === 'large',
        'ant-input-sm': props.size === 'small',
      });

      const locale = this.getLocale();
      const timePicker = props.showTime ? (
        <TimePicker
          prefixCls="ant-time-picker"
          placeholder={locale.lang.timePlaceholder}
          transitionName="slide-up" />
      ) : null;

      return (
        <Picker
          {...this.props}
          pickerClass={pickerClass}
          pickerInputClass={pickerInputClass}
          locale={locale}
          timePicker={timePicker}
          toggleOpen={this.toggleOpen}
          handleInputChange={this.handleInputChange}
          getFormatter={this.getFormatter}
          parseDateFromValue={this.parseDateFromValue}
        />
      );
    }
  };
}
