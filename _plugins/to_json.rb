require 'json'
module JsonFilter
  def to_json(obj)
    return "" if obj.nil?
    JSON.pretty_generate(obj)
  end
end
Liquid::Template.register_filter JsonFilter
