'use strict'

var React = require('react/addons')
var cx = React.addons.classSet

var Dropdown = React.createClass({

  displayName: 'Dropdown',

  propTypes: {
    value: React.PropTypes.object,
    options: React.PropTypes.array,
    onChange: React.PropTypes.func,

    className: React.PropTypes.string,
    isOpenClassName: React.PropTypes.string,
    controlClassName: React.PropTypes.string,
    arrowClassName: React.PropTypes.string,
    placeholderClassName: React.PropTypes.string,

    noSelectionMessage: React.PropTypes.string,

    menuClassName: React.PropTypes.string,
    optionClassName: React.PropTypes.string,
    isSelectedClassName: React.PropTypes.string,
    groupClassName: React.PropTypes.string,
    groupTitleClassName: React.PropTypes.string,

    noResultsMessage: React.PropTypes.string,
    noResultsClassName: React.PropTypes.string,
  },

  getDefaultProps: function () {
    return {
      className: 'Dropdown',
      isOpenClassName: 'is-open',
      controlClassName: 'Dropdown-control',
      arrowClassName: 'Dropdown-arrow',
      placeholderClassName: 'placeholder',

      noSelectionMessage: 'Select\u2026',

      menuClassName: 'Dropdown-menu',
      optionClassName: 'Dropdown-option',
      isSelectedClassName: 'is-selected',
      groupClassName: 'group',
      groupTitleClassName: 'title',

      noOptionsMessage: 'No options found',
      noOptionsClassName: 'Dropdown-noresults',
    };
  },

  getInitialState: function() {
    return {
      selected: undefined,
      hovered: undefined,
      isOpen: false
    }
  },

  componentWillMount: function() {
    document.body.addEventListener("click", this.handleBodyClick, true);
    this.setState({
      selected: this.props.value || { label: 'Select...', value: '' }
    })
  },

  componentWillUnmount: function () {
    document.body.removeEventListener("click", this.handleBodyClick, true);
  },

  componentWillReceiveProps: function(newProps) {
    if (newProps.value && newProps.value !== this.state.selected) {
      this.setState({selected: newProps.value})
    }
  },

  handleBodyClick: function(event) {

    if (this.state.isOpen) {
      this.setState({isOpen: false});
    }
  },

  handleClick: function(event) {

    if (event.type == 'mousedown' && event.button !== 0) return
    event.stopPropagation()
    event.preventDefault()

    this.setState({
      isOpen: !this.state.isOpen
    })
  },

  handleOptionMouseOver: function (option) {
    this.setState({hovered: option});
  },

  setValue: function(option) {
    var newState = {
      selected: option,
      isOpen: false
    }
    this.fireChangeEvent(newState)
    this.setState(newState)
  },

  fireChangeEvent: function(newState) {
    if (newState.selected !== this.state.selected &&this.props.onChange) {
      this.props.onChange(newState.selected);
    }
  },

  renderOption: function (option) {
    var optionClass = cx({
      'Dropdown-option': true,
      'is-selected': (option == this.state.hovered)
    })

    return React.createElement("div", {key: option.value, className: optionClass, 
                onMouseOver: this.handleOptionMouseOver.bind(this), 
                onMouseDown: this.setValue.bind(this, option), 
                onClick: this.setValue.bind(this, option)}, option.label)
  },

  buildMenu: function() {
    var ops = this.props.options.map(function(option) {

      if (option.type == 'group') {
        var groupTitle = (React.createElement("div", {className: this.props.groupTitleClassName}, option.name))
        var _options = option.items.map(function(item) {
          return this.renderOption(item)
        }.bind(this))
        return (
          React.createElement("div", {className: this.props.groupClassName, key: option.name}, 
            groupTitle, 
            _options
          )
        )
      } else {
        return this.renderOption(option)
      }

    }.bind(this))

    return ops.length ? ops : React.createElement("div", {className: this.props.noOptionsClassName}, 
                              "this.props.noResultsMessage"
                              );
  },

  render: function() {
    var value = ''

    value = (this.state.selected.label);

    var menu = this.state.isOpen ? React.createElement("div", {className: this.props.menuClassName}, this.buildMenu()) : null

    var dropdownClasses = {};
    dropdownClasses[this.props.className] = true;
    dropdownClasses[this.props.isOpenClassName] = this.state.isOpen;

    return (
      React.createElement("div", {className: dropdownClasses}, 
        React.createElement("div", {className: this.props.controlClassName, onClick: this.handleClick, onTouchEnd: this.handleClick}, 
          value, 
          React.createElement("span", {className: this.props.arrowClassName})
        ), 
        menu
      )
    );
  }

})

module.exports = Dropdown